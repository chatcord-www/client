"use client";

import { VoiceRoomContext } from "@/components/providers/voice-room";
import { buildVoiceRoomId } from "@/lib/voice";
import { useCallback, useContext } from "react";

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
  const isObserving = voiceRoom.observedRoomId === roomId;

  const participants = isJoined
    ? voiceRoom.participants
    : isObserving
      ? voiceRoom.observedParticipants
      : [];

  return {
    errorKey: isJoined || isConnecting ? voiceRoom.errorKey : null,
    isConnecting,
    isDeafened: voiceRoom.isDeafened,
    isJoined,
    isMuted: voiceRoom.isMuted,
    joinRoom: useCallback(
      () => voiceRoom.joinRoom({ channelId, serverId }),
      [channelId, serverId, voiceRoom.joinRoom],
    ),
    leaveRoom: voiceRoom.leaveRoom,
    observeRoom: useCallback(
      () => voiceRoom.observeRoom({ channelId, serverId }),
      [channelId, serverId, voiceRoom.observeRoom],
    ),
    participants,
    stopObservingRoom: useCallback(
      () => voiceRoom.stopObservingRoom(roomId),
      [roomId, voiceRoom.stopObservingRoom],
    ),
    toggleDeafen: voiceRoom.toggleDeafen,
    toggleMute: voiceRoom.toggleMute,
  };
};
