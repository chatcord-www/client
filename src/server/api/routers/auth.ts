import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateUniqueDiscriminator } from "@/server/discriminator";
import { sendConfirmationEmail } from "@/server/email";
import { users } from "@/server/db/schema";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { z } from "zod";

const CONFIRMATION_CODE_LENGTH = 6;

function getJwtSecret() {
  return env.NEXTAUTH_SECRET ?? "dev-secret";
}

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

      const passwordHash = await bcrypt.hash(input.password, 12);

      const confirmationCode = Array.from(
        { length: CONFIRMATION_CODE_LENGTH },
        () => Math.floor(Math.random() * 10),
      ).join("");

      const token = jwt.sign(
        {
          username: input.username,
          email: input.email,
          password: passwordHash,
          confirmationCode,
        },
        getJwtSecret(),
        { expiresIn: "15m" },
      );

      await sendConfirmationEmail(input.email, confirmationCode);

      return { token };
    }),

  confirmEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
        code: z.string().length(CONFIRMATION_CODE_LENGTH),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let decoded: {
        username: string;
        email: string;
        password: string;
        confirmationCode: string;
      };

      try {
        decoded = jwt.verify(input.token, getJwtSecret()) as typeof decoded;
      } catch {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "token-expired",
        });
      }

      if (decoded.confirmationCode !== input.code) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "invalid-code",
        });
      }

      const existing = await ctx.db.query.users.findFirst({
        columns: { id: true },
        where: eq(users.email, decoded.email),
      });

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "email-taken" });
      }

      const discriminator = await generateUniqueDiscriminator(decoded.username);

      await ctx.db.insert(users).values({
        name: decoded.username,
        email: decoded.email,
        discriminator,
        password: decoded.password,
      });

      return { success: true };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        columns: { id: true, password: true },
        where: eq(users.email, input.email),
      });

      if (!user?.password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "invalid-credentials",
        });
      }

      const valid = await bcrypt.compare(input.password, user.password);

      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "invalid-credentials",
        });
      }

      return { userId: user.id };
    }),
});
