import { publicProcedure } from "@/server/api/trpc";
import { messages } from "@/server/db/schema";
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
      })
      .returning();

    return {
      content: message[0]?.content as string,
      id: message[0]?.id as string,
      createdAt: message[0]?.createdAt as Date,
      user: {
        id: ctx.session?.user.id as string,
        name: ctx.session?.user.name as string,
        avatar: ctx.session?.user.image as string,
      },
    };
  });
