import { z, type ZodType } from "zod";

export type RecoverFormType = {
  email: string;
};

export const RecoverFormSchema: ZodType<RecoverFormType> = z.object({
  email: z.string({ message: "required" }).email({ message: "email" }),
});
