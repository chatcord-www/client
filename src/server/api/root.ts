import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { getMessages } from "./routers/getMessages";
import { sendMessage } from "./routers/sendMessage";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  sendMessage,
  getMessages,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
