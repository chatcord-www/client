import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateUniqueDiscriminator } from "@/server/discriminator";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        username: z.string().min(4),
        email: z.string().email(),
        password: z.string().min(8),
        repeat_password: z.string().min(8),
        })
      .refine(({ password, repeat_password }) => password === repeat_password, {
        message: "password-not-match",
        path: ["repeat_password"],
        }),
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await ctx.db.query.users.findFirst({
        columns: { id: true },
        where: eq(users.email, input.email),
      });

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "email-taken" });
      }

      const discriminator = await generateUniqueDiscriminator(input.username);

      const passwordHash = await bcrypt.hash(input.password, 12);

      await ctx.db.insert(users).values({
        name: input.username,
        email: input.email,
        discriminator,
        password: passwordHash,
      });

      return { success: true };
    }),
});
