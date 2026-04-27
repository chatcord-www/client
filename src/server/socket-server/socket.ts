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

    socket.on("connect_direct", (userId, friendId) => {
      socket.join([userId, friendId].sort().join(":"));
      console.log(`User ${socket.id} joined direct room ${[userId, friendId].sort().join(":")  }`);
    });

    socket.on("receive_direct_message", (userId, friendId, message) => {
      io.to([userId, friendId].sort().join(":")).emit("direct_message_polling", message);
      console.log(
        `Direct message sent in ${[userId, friendId].sort().join(":")}: ${JSON.stringify(message)}`
      );
    });

    socket.on("typing_guild", (serverId, channelId, message) => {
      io.to(`${serverId}:${channelId}`).emit("typing_polling", message);
    });

    socket.on("typing_direct", (userId, friendId, message) => {
      io.to([userId, friendId].sort().join(":")).emit("direct_typing_polling", message);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
