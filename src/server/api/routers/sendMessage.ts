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
    await ctx.db.insert(messages).values({
      content: input.text,
      channelId: input.channelId,
      serverId: input.serverId,
      userId: ctx.session?.user.id,
    });

    return {
      success: true,
    };
  });
