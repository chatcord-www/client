import { z, ZodType } from "zod";

export type SignupFormType = {
  email: string;
  password: string;
  username: string;
  repeat_password: string;
};

export const SignupFormSchema: ZodType<SignupFormType> = z
  .object({
    email: z.string({ message: "required" }).email({ message: "email" }),
    password: z
      .string({ message: "required" })
      .min(8, { message: "password-short" }),
    repeat_password: z.string({ message: "required" }).min(8, { message: "password-not-match" }),
    username: z
      .string({ message: "required" })
      .min(4, { message: "username-min" }),
  })
  .superRefine(({ repeat_password, password }, ctx) => {
    if (repeat_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "password-not-match",
        path: ["confirmPassword"],
      });
    }
  });
