import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  updateActivity: protectedProcedure
    .input(
      z.object({
        activity: z.enum(["ONLINE", "IDLE", "DND", "OFFLINE"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(users)
        .set({ activity: input.activity })
        .where(eq(users.id, ctx.session.user.id));

      return { activity: input.activity };
    }),
});
