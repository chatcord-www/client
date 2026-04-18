import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { generateUniqueDiscriminator } from "@/server/discriminator";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
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
  updateProfile: protectedProcedure
    .input(
      z
        .object({
          name: z.string().trim().min(1).max(255).optional(),
          aboutMe: z.string().trim().max(255).optional(),
          image: z.string().url().optional(),
          bannerColor: z
            .string()
            .regex(/^#[0-9a-fA-F]{6}$/)
            .optional(),
        })
        .refine(
          ({ name, aboutMe, image, bannerColor }) =>
            name !== undefined || aboutMe !== undefined || image !== undefined || bannerColor !== undefined,
          {
            message: "at-least-one-field",
          },
        ),
    )
    .mutation(async ({ input, ctx }) => {
      const currentUser = await ctx.db.query.users.findFirst({
        columns: {
          name: true,
          discriminator: true,
          aboutMe: true,
          image: true,
          bannerColor: true,
        },
        where: eq(users.id, ctx.session.user.id),
      }); 

      if (!currentUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "user-not-found" });
      }

      const updateData: {
        name?: string;
        aboutMe?: string | null;
        image?: string | null;
        bannerColor?: string | null;
        discriminator?: string | null;
      } = {
        name: input.name,
        aboutMe: input.aboutMe,
        image: input.image,
        bannerColor: input.bannerColor,
      };

      if (input.name !== undefined) {
        updateData.name = input.name;
        if (currentUser.name !== input.name) {
          updateData.discriminator = await generateUniqueDiscriminator(input.name);
        }
      }

      if (input.aboutMe !== undefined) {
        updateData.aboutMe = input.aboutMe.length > 0 ? input.aboutMe : null;
      }

      if (input.image !== undefined) {
        updateData.image = input.image;
      }

      if (input.bannerColor !== undefined) {
        updateData.bannerColor = input.bannerColor;
      }
      await ctx.db
        .update(users)
        .set(updateData)
        .where(eq(users.id, ctx.session.user.id));

      return { success: true };
    }),
});
