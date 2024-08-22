import { publicProcedure } from "@/server/api/trpc";
import { messages } from "@/server/db/schema";
import { z } from "zod";
import { isAuthorized } from "../middleware/is-auth";

export const sendMessage = publicProcedure
  .use(isAuthorized)
  .input(
    z.object({
      text: z.string().max(1024),
      channelId: z.string(),
      serverId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const message = await ctx.db
      .insert(messages)
      .values({
        content: input.text,
        channelId: input.channelId,
        serverId: input.serverId,
        userId: ctx.session?.user.id,
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
