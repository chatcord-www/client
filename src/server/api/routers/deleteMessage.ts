import { publicProcedure } from "@/server/api/trpc";
import { messages } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { isAuthorized } from "../middleware/is-auth";

export const deleteMessage = publicProcedure
  .use(isAuthorized)
  .input(
    z.object({
      messageId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const found = await ctx.db.query.messages.findFirst({
      where: eq(messages.id, input.messageId),
      columns: { id: true, userId: true },
    });
    if (!found) {
      throw new Error("Message not found");
    }
    if (found.userId !== ctx.session?.user.id) {
      throw new Error("Not authorized to delete this message");
    }

    await ctx.db.delete(messages).where(eq(messages.id, input.messageId));
    return { id: input.messageId };
  });