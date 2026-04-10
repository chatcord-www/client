import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { getMessages } from "./routers/getMessages";
import { sendMessage } from "./routers/sendMessage";
import { serverRouter } from "./routers/server";
import { userRouter } from "./routers/user";
import { editMessage } from "./routers/editMessage";
import { deleteMessage } from "./routers/deleteMessage";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  server: serverRouter,
  user: userRouter,
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
