import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { getMessages } from "./routers/getMessages";
import { sendMessage } from "./routers/sendMessage";
import { serverRouter } from "./routers/server";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  server: serverRouter,
  sendMessage,
  getMessages,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
