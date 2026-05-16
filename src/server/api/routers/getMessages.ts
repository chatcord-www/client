import { publicProcedure } from "@/server/api/trpc";
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
    const currentUserId = ctx.session?.user.id

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
      with: { 
        users: true,
        reactions: {
          columns: {
            id: true,
            emoji: true,
          },
          with: {
            reactedBy: {
              columns: {
                userId: true,
              },
              with: {
                user: {
                  columns: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        replyTo: {
          with: {
            users: true,
          },
        },
      },
      orderBy: (messages) => asc(messages.createdAt),
    });

    return messages.map((message) => ({
      reactions: message.reactions.map((reaction) => ({
        id: reaction.id,
        emoji: reaction.emoji,
        count: reaction.reactedBy.length,
        reacted: reaction.reactedBy.some(
          (value) => value.userId === currentUserId,
        ),
        users: reaction.reactedBy.map((value) => ({
          id: value.user?.id ?? value.userId,
          name: value.user?.name,
          avatar: value.user?.image,
        })),
      })),
      content: message.content,
      id: message.id,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      replyToId: message.replyToId,
      replyTo: message.replyTo ? {
        id: message.replyTo.id,
        content: message.replyTo.content,
        user: {
          id: message.replyTo.users?.id,
          name: message.replyTo.users?.name,
          avatar: message.replyTo.users?.image,
        },
      } : null,
      user: {
        id: message.users?.id,
        name: message.users?.name,
        avatar: message.users?.image,
      },
    }));
  });
