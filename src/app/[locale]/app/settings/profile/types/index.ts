import { z, ZodType } from "zod";

export type ProfileFormType = {
  name: string;
  aboutMe: string;
  bannerColor: string;
};

export const ProfileFormSchema = z.object({
  name: z.string({ message: "required" }).min(1, { message: "required" }).max(255),
  aboutMe: z.string().max(255).default(""),
  bannerColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, { message: "invalid-color" })
    .default("#f472b6"),
});
