import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";

export const isAuthorized = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "unauthorized user",
    });
  }

  return next();
});
