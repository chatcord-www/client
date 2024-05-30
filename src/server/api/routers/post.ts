import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { users } from "@/server/db/schema";

export const postRouter = publicProcedure
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {});
