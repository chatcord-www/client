export const VOICE_SOCKET_EVENTS = {
  joinRoom: "voice_join_room",
  leaveRoom: "voice_leave_room",
  signal: "voice_signal",
  participantJoined: "voice_participant_joined",
  participantLeft: "voice_participant_left",
  participantState: "voice_participant_state",
} as const;

export const VOICE_JOIN_TIMEOUT_MS = 5000;

export type VoiceParticipantPayload = {
  socketId: string;
  userId: string;
  name: string;
  avatar: string | null;
  muted: boolean;
};

export type VoiceParticipantStatePayload = {
  muted: boolean;
};

export type VoiceSignalPayload =
  | {
      type: "offer" | "answer";
      description: RTCSessionDescriptionInit;
    }
  | {
      type: "candidate";
      candidate: RTCIceCandidateInit;
    };

export type VoiceSignalEvent = {
  roomId: string;
  fromSocketId: string;
  participant: VoiceParticipantPayload;
  signal: VoiceSignalPayload;
};

export type VoiceParticipantEvent = {
  roomId: string;
  participant: VoiceParticipantPayload;
};

export type VoiceParticipantLeftEvent = {
  roomId: string;
  socketId: string;
};

export type VoiceParticipantStateEvent = {
  roomId: string;
  socketId: string;
  state: VoiceParticipantStatePayload;
};

export type VoiceJoinResponse = {
  participants: VoiceParticipantPayload[];
};

export const buildVoiceRoomId = (serverId: string, channelId: string) =>
  `${serverId}:${channelId}:voice`;