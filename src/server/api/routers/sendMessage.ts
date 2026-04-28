import { publicProcedure } from "@/server/api/trpc";
import { messages } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { isAuthorized } from "../middleware/is-auth";

export const sendMessage = publicProcedure
  .use(isAuthorized)
  .input(
    z.object({
      text: z.string().max(1024),
      channelId: z.string().optional(),
      serverId: z.string().optional(),
      friendId: z.string().optional(),
      replyToId: z.string().optional(),
      })
  )
  .mutation(async ({ input, ctx }) => {
    const message = await ctx.db
      .insert(messages)
      .values({
        content: input.text,
        mode: input.friendId ? "DIRECT" : "CHANNEL",
        friendId: input.friendId,
        channelId: input.channelId,
        serverId: input.serverId,
        userId: ctx.session?.user.id as string,
        replyToId: input.replyToId,
      })
      .returning();

    // Fetch the full message with reply details
    const fullMessage = await ctx.db.query.messages.findFirst({
      where: (m) => eq(m.id, message[0]?.id as string),
      with: {
        users: true,
        replyTo: {
          with: {
            users: true,
          },
        },
      },
    });

    return {
      content: fullMessage?.content as string,
      id: fullMessage?.id as string,
      createdAt: fullMessage?.createdAt as Date,
      replyToId: fullMessage?.replyToId,
      replyTo: fullMessage?.replyTo ? {
        id: fullMessage.replyTo.id,
        content: fullMessage.replyTo.content,
        user: {
          id: fullMessage.replyTo.users?.id,
          name: fullMessage.replyTo.users?.name,
          avatar: fullMessage.replyTo.users?.image,
        },
      } : null,
      user: {
        id: ctx.session?.user.id as string,
        name: ctx.session?.user.name as string,
        avatar: ctx.session?.user.image as string,
      },
    };
  });
