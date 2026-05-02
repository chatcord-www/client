import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { allowedOrigins } from "./config";
import {
  VOICE_SOCKET_EVENTS,
  type VoiceJoinResponse,
  type VoiceParticipantPayload,
  type VoiceRoomObserverResponse,
  type VoiceParticipantStatePayload,
  type VoiceSignalPayload,
  buildVoiceObserverRoomId,
} from "../../lib/voice";

type VoiceParticipant = VoiceParticipantPayload & {
  roomId: string;
};

const voiceParticipantsBySocket = new Map<string, VoiceParticipant>();
const voiceRooms = new Map<string, Set<string>>();
const observedVoiceRoomsBySocket = new Map<string, string>();

const serializeParticipant = ({ roomId: _roomId, ...participant }: VoiceParticipant) => participant;

const getRoomParticipants = (roomId: string) =>
  Array.from(voiceRooms.get(roomId) ?? [])
    .map((participantSocketId) => voiceParticipantsBySocket.get(participantSocketId))
    .filter((value): value is VoiceParticipant => Boolean(value));

const emitVoiceRoomEvent = (io: Server, roomId: string, event: string, payload: unknown) => {
  io.to(roomId).to(buildVoiceObserverRoomId(roomId)).emit(event, payload);
};

const stopObservingVoiceRoom = (socket: Parameters<Server["on"]>[1] extends (socket: infer T) => void ? T : never) => {
  const observedRoomId = observedVoiceRoomsBySocket.get(socket.id);

  if (!observedRoomId) return;

  socket.leave(buildVoiceObserverRoomId(observedRoomId));
  observedVoiceRoomsBySocket.delete(socket.id);
};

const leaveVoiceRoom = (io: Server, socketId: string) => {
  const participant = voiceParticipantsBySocket.get(socketId);

  if (!participant) return;

  const roomSockets = voiceRooms.get(participant.roomId);
  roomSockets?.delete(socketId);

  if (roomSockets?.size === 0) {
    voiceRooms.delete(participant.roomId);
  }

  voiceParticipantsBySocket.delete(socketId);
  emitVoiceRoomEvent(io, participant.roomId, VOICE_SOCKET_EVENTS.participantLeft, {
    roomId: participant.roomId,
    socketId,
  });
};

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
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

    socket.on(VOICE_SOCKET_EVENTS.joinRoom, (roomId: string, participant: VoiceParticipantPayload, callback?: (response: VoiceJoinResponse) => void) => {
      leaveVoiceRoom(io, socket.id);

      socket.join(roomId);

      const roomParticipants = getRoomParticipants(roomId);

      const nextParticipant: VoiceParticipant = {
        socketId: socket.id,
        userId: participant.userId,
        name: participant.name,
        avatar: participant.avatar ?? null,
        roomId,
        muted: false,
      };

      voiceParticipantsBySocket.set(socket.id, nextParticipant);

      if (!voiceRooms.has(roomId)) {
        voiceRooms.set(roomId, new Set());
      }

      voiceRooms.get(roomId)?.add(socket.id);

      if (typeof callback === "function") {
        callback({
          participants: roomParticipants.map(serializeParticipant),
        });
      }

      emitVoiceRoomEvent(io, roomId, VOICE_SOCKET_EVENTS.participantJoined, {
        roomId,
        participant: serializeParticipant(nextParticipant),
      });
    });

    socket.on(
      VOICE_SOCKET_EVENTS.observeRoom,
      (
        roomId: string,
        callback?: (response: VoiceRoomObserverResponse) => void,
      ) => {
        stopObservingVoiceRoom(socket);
        observedVoiceRoomsBySocket.set(socket.id, roomId);
        socket.join(buildVoiceObserverRoomId(roomId));

        if (typeof callback === "function") {
          callback({
            participants: getRoomParticipants(roomId).map(serializeParticipant),
          });
        }
      },
    );

    socket.on(VOICE_SOCKET_EVENTS.stopObservingRoom, (roomId?: string) => {
      const observedRoomId = observedVoiceRoomsBySocket.get(socket.id);

      if (!observedRoomId || (roomId && observedRoomId !== roomId)) return;

      stopObservingVoiceRoom(socket);
    });

    socket.on(VOICE_SOCKET_EVENTS.signal, (roomId: string, targetSocketId: string, signal: VoiceSignalPayload) => {
      const sender = voiceParticipantsBySocket.get(socket.id);
      const receiver = voiceParticipantsBySocket.get(targetSocketId);

      if (!sender || !receiver) return;
      if (sender.roomId !== roomId || receiver.roomId !== roomId) return;

      io.to(targetSocketId).emit(VOICE_SOCKET_EVENTS.signal, {
        roomId,
        fromSocketId: socket.id,
        participant: serializeParticipant(sender),
        signal,
      });
    });

    socket.on(VOICE_SOCKET_EVENTS.participantState, (roomId: string, state: VoiceParticipantStatePayload) => {
      const participant = voiceParticipantsBySocket.get(socket.id);

      if (!participant || participant.roomId !== roomId) return;

      participant.muted = Boolean(state?.muted);
      voiceParticipantsBySocket.set(socket.id, participant);

      emitVoiceRoomEvent(io, roomId, VOICE_SOCKET_EVENTS.participantState, {
        roomId,
        socketId: socket.id,
        state: {
          muted: participant.muted,
        },
      });
    });

    socket.on(VOICE_SOCKET_EVENTS.leaveRoom, (roomId: string) => {
      const participant = voiceParticipantsBySocket.get(socket.id);

      if (!participant || participant.roomId !== roomId) return;

      socket.leave(roomId);
      leaveVoiceRoom(io, socket.id);
    });

    socket.on("disconnect", () => {
      stopObservingVoiceRoom(socket);
      leaveVoiceRoom(io, socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
