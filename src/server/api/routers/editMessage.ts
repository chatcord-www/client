import { publicProcedure } from "@/server/api/trpc";
import { messages } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { isAuthorized } from "../middleware/is-auth";

export const editMessage = publicProcedure
  .use(isAuthorized)
  .input(
    z.object({
      messageId: z.string(),
      newContent: z.string().max(1024),
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
      throw new Error("Not authorized to edit this message");
    }

    const updated = await ctx.db
      .update(messages)
      .set({ content: input.newContent,
             editedAt: new Date()
         })
      .where(eq(messages.id, input.messageId))
      .returning();
    return {
      id: updated[0]?.id,
      content: updated[0]?.content,
      editedAt: updated[0]?.editedAt,
    };
  });