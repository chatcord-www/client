import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const postRouter = publicProcedure.input(
  z.object({
    name: z.string(),
  }),
);
