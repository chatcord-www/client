"use client";

import { VoiceRoomContext } from "@/components/providers/voice-room";
import { buildVoiceRoomId } from "@/lib/voice";
import { useContext } from "react";

type UseVoiceRoomProps = {
  channelId: string;
  serverId: string;
};

export const useVoiceRoom = ({ channelId, serverId }: UseVoiceRoomProps) => {
  const voiceRoom = useContext(VoiceRoomContext);

  if (!voiceRoom) {
    throw new Error("useVoiceRoom must be used within VoiceRoomProvider");
  }

  const roomId = buildVoiceRoomId(serverId, channelId);
  const isJoined = voiceRoom.activeRoomId === roomId;
  const isConnecting = voiceRoom.connectingRoomId === roomId;

  return {
    errorKey: isJoined || isConnecting ? voiceRoom.errorKey : null,
    isConnecting,
    isDeafened: voiceRoom.isDeafened,
    isJoined,
    isMuted: voiceRoom.isMuted,
    joinRoom: () => voiceRoom.joinRoom({ channelId, serverId }),
    leaveRoom: voiceRoom.leaveRoom,
    participants: isJoined ? voiceRoom.participants : [],
    toggleDeafen: voiceRoom.toggleDeafen,
    toggleMute: voiceRoom.toggleMute,
  };
};
