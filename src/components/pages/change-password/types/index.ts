import { z, type ZodType } from "zod";

export type ChangePasswordFormType = {
  current_password: string;
  password: string;
  repeat_password: string;
};

export const ChangePasswordFormSchema: ZodType<ChangePasswordFormType> = z
  .object({
    current_password: z
      .string({ message: "required" })
      .min(8, { message: "password-short" }),
    password: z
      .string({ message: "required" })
      .min(8, { message: "password-short" }),
    repeat_password: z
      .string({ message: "required" })
      .min(8, { message: "password-short" }),
  })
  .refine(({ password, repeat_password }) => password === repeat_password, {
    message: "password-not-match",
    path: ["repeat_password"],
  });
