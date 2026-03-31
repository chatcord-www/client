import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "https://chatc0rd.vercel.app"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 30000,
    pingInterval: 10000,
    maxHttpBufferSize: 1e6,
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("connect_guild", (serverId, channelId) => {
      socket.join(`${serverId}:${channelId}`);
      console.log(`User ${socket.id} joined ${serverId}:${channelId}`);
    });

    socket.on("receive_message", (serverId, channelId, message) => {
      io.to(`${serverId}:${channelId}`).emit("message_polling", message);
      console.log(
        `Message sent in ${serverId}:${channelId}: ${JSON.stringify(message)}`
      );
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
