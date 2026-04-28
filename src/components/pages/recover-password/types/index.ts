import { z, type ZodType } from "zod";

export type RecoverRequestFormType = {
  email: string;
};

export type RecoverResetFormType = {
  code: string;
  password: string;
  repeat_password: string;
};

export const RecoverRequestFormSchema: ZodType<RecoverRequestFormType> = z.object({
  email: z.string({ message: "required" }).email({ message: "email" }),
});

export const RecoverResetFormSchema: ZodType<RecoverResetFormType> = z
  .object({
    code: z
      .string({ message: "required" })
      .regex(/^\d{6}$/, { message: "code-invalid" }),
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
