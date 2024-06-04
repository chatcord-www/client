import { z, ZodType } from "zod";

export type LoginFormType = {
  email: string;
  password: string;
};

export const LoginFormSchema: ZodType<LoginFormType> = z.object({
  email: z.string({ message: "required" }).email({ message: "email" }),
  password: z
    .string({ message: "required" })
    .min(8, { message: "password-short" }),
});
