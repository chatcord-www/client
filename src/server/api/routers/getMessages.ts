import { publicProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { isAuthorized } from "../middleware/is-auth";

export const getMessages = publicProcedure
  .use(isAuthorized)
  .input(
    z.object({
      channelId: z.string(),
      serverId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const messages = await ctx.db.query.messages.findMany({
      where: (messages, { and }) =>
        and(
          eq(messages.serverId, input.serverId),
          eq(messages.channelId, input.channelId),
        ),
      limit: 50,
      with: { users: true },
    });

    return messages.map((message) => ({
      content: message.content,
      id: message.id,
      createdAt: message.createdAt,
      user: {
        id: message.users?.id,
        name: message.users?.name,
        avatar: message.users?.image,
      },
    }));
  });
