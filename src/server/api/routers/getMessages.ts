import { publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, or } from "drizzle-orm";
import { z } from "zod";
import { isAuthorized } from "../middleware/is-auth";

export const getMessages = publicProcedure
  .use(isAuthorized)
  .input(
    z.object({
      channelId: z.string().optional(),
      serverId: z.string().optional(),
      friendId: z.string().optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const messages = await ctx.db.query.messages.findMany({
      where: (messages) =>
        input.friendId
          ? or(
              and(
                eq(messages.userId, ctx.session?.user.id as string),
                eq(messages.friendId, input.friendId),
              ),
              and(
                eq(messages.userId, input.friendId),
                eq(messages.friendId, ctx.session?.user.id as string),
              ),
            )
          : and(
          eq(messages.serverId, input.serverId as string),
          eq(messages.channelId, input.channelId as string),
        ),
      with: { users: true },
      orderBy: (messages) => asc(messages.createdAt),
    });

    return messages.map((message) => ({
      content: message.content,
      id: message.id,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      user: {
        id: message.users?.id,
        name: message.users?.name,
        avatar: message.users?.image,
      },
    }));
  });
