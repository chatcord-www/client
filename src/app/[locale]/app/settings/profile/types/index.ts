import { z, ZodType } from "zod";

export type ProfileFormType = {
  name: string;
  aboutMe: string;
};

export const ProfileFormSchema = z.object({
  name: z.string({ message: "required" }).min(1, { message: "required" }).max(255),
  aboutMe: z.string().max(255).default(""),
});
