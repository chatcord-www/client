import { publicProcedure } from "@/server/api/trpc";
import {
  messageReactions,
  messageReactionUsers,
  messages,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isAuthorized } from "../middleware/is-auth";

const inputSchema = z.object({
  messageId: z.string(),
  emoji: z.string().trim().min(1).max(64),
});

export const addReaction = publicProcedure
  .use(isAuthorized)
  .input(inputSchema)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session?.user.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const targetMessage = await ctx.db.query.messages.findFirst({
      where: eq(messages.id, input.messageId),
      columns: {
        id: true,
        mode: true,
        userId: true,
        friendId: true,
      },
    });

    if (!targetMessage) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Message not found",
      });
    }

    if (
      targetMessage.mode === "DIRECT" &&
      targetMessage.userId !== userId &&
      targetMessage.friendId !== userId
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to react to this message",
      });
    }

    const existingReaction = await ctx.db.query.messageReactions.findFirst({
      where: and(
        eq(messageReactions.messageId, input.messageId),
        eq(messageReactions.emoji, input.emoji),
      ),
      columns: {
        id: true,
        emoji: true,
      },
    });

    const totalReactions = await ctx.db.query.messageReactions.findMany({
      where: eq(messageReactions.messageId, input.messageId),
      columns: {
        id: true,
      },
    });

    if (!existingReaction && totalReactions.length >= 10) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Message reactions max count is 10",
      });
    }

    if (!existingReaction) {
      const insertedReaction = await ctx.db
        .insert(messageReactions)
        .values({
          messageId: input.messageId,
          emoji: input.emoji,
        })
        .returning({
          id: messageReactions.id,
        });

      await ctx.db.insert(messageReactionUsers).values({
        reactionId: insertedReaction[0]?.id as string,
        userId,
      });

      return {
        success: true,
      };
    }

    const reactIncludesMe = await ctx.db.query.messageReactionUsers.findFirst({
      where: and(
        eq(messageReactionUsers.reactionId, existingReaction.id),
        eq(messageReactionUsers.userId, userId),
      ),
      columns: {
        userId: true,
      },
    });

    if (!reactIncludesMe) {
      await ctx.db.insert(messageReactionUsers).values({
        reactionId: existingReaction.id,
        userId,
      });

      return {
        success: true,
      };
    }

    await ctx.db
      .delete(messageReactionUsers)
      .where(
        and(
          eq(messageReactionUsers.reactionId, existingReaction.id),
          eq(messageReactionUsers.userId, userId),
        ),
      );

    const reactionUsers = await ctx.db.query.messageReactionUsers.findMany({
      where: eq(messageReactionUsers.reactionId, existingReaction.id),
      columns: {
        userId: true,
      },
    });

    if (reactionUsers.length === 0) {
      await ctx.db
        .delete(messageReactions)
        .where(eq(messageReactions.id, existingReaction.id));
    }

    return {
      success: true,
    };
  });