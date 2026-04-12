import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { getMessages } from "./routers/getMessages";
import { sendMessage } from "./routers/sendMessage";
import { serverRouter } from "./routers/server";
import { userRouter } from "./routers/user";
import { editMessage } from "./routers/editMessage";
import { deleteMessage } from "./routers/deleteMessage";
import { generateSignedUrl } from "./routers/generateSignedUrl";
import { friendRouter } from "./routers/friend";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  server: serverRouter,
  user: userRouter,
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  generateSignedUrl,
  friend: friendRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
