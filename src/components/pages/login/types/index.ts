import { z, ZodType } from "zod";

export type LoginFormType = {
  email: string,
  password: string
}

export const LoginFormSchema: ZodType<LoginFormType> = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "password-short" }),
});
