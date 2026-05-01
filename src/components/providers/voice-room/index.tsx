"use client";

import {
  VOICE_JOIN_TIMEOUT_MS,
  VOICE_SOCKET_EVENTS,
  buildVoiceRoomId,
  type VoiceJoinResponse,
  type VoiceParticipantEvent,
  type VoiceParticipantLeftEvent,
  type VoiceParticipantPayload,
  type VoiceParticipantStateEvent,
  type VoiceSignalEvent,
  type VoiceSignalPayload,
} from "@/lib/voice";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import {
  createContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

type VoiceRoomTarget = {
  channelId: string;
  serverId: string;
};

export type VoiceParticipant = VoiceParticipantPayload & {
  isLocal: boolean;
  stream: MediaStream | null;
};

export type VoiceRoomContextValue = {
  activeRoomId: string | null;
  connectingRoomId: string | null;
  errorKey: string | null;
  isDeafened: boolean;
  isMuted: boolean;
  joinRoom: ({ channelId, serverId }: VoiceRoomTarget) => Promise<void>;
  leaveRoom: () => Promise<void>;
  participants: VoiceParticipant[];
  toggleDeafen: () => void;
  toggleMute: () => void;
};

type MicrophonePermissionState = PermissionState | "unknown";

export const VoiceRoomContext = createContext<VoiceRoomContextValue | null>(null);

const rtcConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

const createParticipant = (
  participant: VoiceParticipantPayload,
  isLocal: boolean,
  stream: MediaStream | null,
): VoiceParticipant => ({
  ...participant,
  isLocal,
  stream,
});

const getMicrophonePermissionState = async (): Promise<MicrophonePermissionState> => {
  if (!("permissions" in navigator) || !("query" in navigator.permissions)) {
    return "unknown";
  }

  try {
    const status = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });

    return status.state;
  } catch {
    return "unknown";
  }
};

const getMicrophoneStream = async () => {
  const preferredConstraints: MediaStreamConstraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  };

  try {
    return await navigator.mediaDevices.getUserMedia(preferredConstraints);
  } catch {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
  }
};

const mapJoinError = (
  error: unknown,
  permissionState: MicrophonePermissionState,
) => {
  if (error instanceof Error && error.message === "VOICE_JOIN_TIMEOUT") {
    return "voice.join-timeout";
  }

  if (!(error instanceof DOMException)) {
    return "voice.connection-error";
  }

  if (error.name === "NotAllowedError") {
    return permissionState === "denied"
      ? "voice.microphone-error"
      : "voice.microphone-unavailable";
  }

  if (error.name === "NotFoundError") {
    return "voice.no-microphone";
  }

  if (error.name === "NotReadableError" || error.name === "AbortError") {
    return "voice.microphone-busy";
  }

  if (error.name === "OverconstrainedError") {
    return "voice.microphone-constraints";
  }

  return "voice.connection-error";
};

export const VoiceRoomProvider = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession();
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [connectingRoomId, setConnectingRoomId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const activeRoomRef = useRef<string | null>(null);

  const updateParticipant = (
    socketId: string,
    updater: (participant: VoiceParticipant) => VoiceParticipant,
  ) => {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) =>
        participant.socketId === socketId ? updater(participant) : participant,
      ),
    );
  };

  const upsertParticipant = (
    participant: VoiceParticipantPayload,
    isLocal: boolean,
    stream: MediaStream | null,
  ) => {
    setParticipants((currentParticipants) => {
      const existingParticipant = currentParticipants.find(
        (value) => value.socketId === participant.socketId,
      );

      if (!existingParticipant) {
        return [...currentParticipants, createParticipant(participant, isLocal, stream)];
      }

      return currentParticipants.map((value) =>
        value.socketId === participant.socketId
          ? {
              ...value,
              ...participant,
              isLocal,
              stream: stream ?? value.stream,
            }
          : value,
      );
    });
  };

  const removeParticipant = (socketId: string) => {
    setParticipants((currentParticipants) =>
      currentParticipants.filter((participant) => participant.socketId !== socketId),
    );
  };

  const flushPendingCandidates = async (socketId: string) => {
    const peerConnection = peerConnectionsRef.current.get(socketId);
    const candidates = pendingCandidatesRef.current.get(socketId);

    if (!peerConnection || !candidates?.length) return;

    for (const candidate of candidates) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }

    pendingCandidatesRef.current.delete(socketId);
  };

  const createPeerConnection = (
    roomId: string,
    participant: VoiceParticipantPayload,
  ) => {
    const existingConnection = peerConnectionsRef.current.get(participant.socketId);

    if (existingConnection) {
      return existingConnection;
    }

    const peerConnection = new RTCPeerConnection(rtcConfiguration);

    microphoneStreamRef.current?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, microphoneStreamRef.current as MediaStream);
    });

    peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return;

      socket.emit(VOICE_SOCKET_EVENTS.signal, roomId, participant.socketId, {
        type: "candidate",
        candidate: event.candidate.toJSON(),
      } satisfies VoiceSignalPayload);
    };

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      upsertParticipant(participant, false, stream ?? null);
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "failed") {
        peerConnection.close();
        peerConnectionsRef.current.delete(participant.socketId);
      }
    };

    peerConnectionsRef.current.set(participant.socketId, peerConnection);

    return peerConnection;
  };

  const createOffer = async (
    roomId: string,
    participant: VoiceParticipantPayload,
  ) => {
    const peerConnection = createPeerConnection(roomId, participant);
    const offer = await peerConnection.createOffer({ offerToReceiveAudio: true });
    await peerConnection.setLocalDescription(offer);

    socket.emit(VOICE_SOCKET_EVENTS.signal, roomId, participant.socketId, {
      type: "offer",
      description: offer,
    } satisfies VoiceSignalPayload);
  };

  const closeConnections = () => {
    peerConnectionsRef.current.forEach((peerConnection) => peerConnection.close());
    peerConnectionsRef.current.clear();
    pendingCandidatesRef.current.clear();
  };

  const stopLocalStream = () => {
    microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
    microphoneStreamRef.current = null;
  };

  const resetRoomState = () => {
    closeConnections();
    stopLocalStream();
    setParticipants([]);
    setActiveRoomId(null);
    setConnectingRoomId(null);
    setIsMuted(false);
    setIsDeafened(false);
    activeRoomRef.current = null;
  };

  const ensureSocketConnection = async () => {
    if (socket.connected) return;

    socket.connect();

    await new Promise<void>((resolve) => {
      const onConnect = () => {
        socket.off("connect_error", onError);
        resolve();
      };

      const onError = () => {
        socket.off("connect", onConnect);
        resolve();
      };

      socket.once("connect", onConnect);
      socket.once("connect_error", onError);
    });
  };

  const leaveRoom = async () => {
    if (activeRoomRef.current && socket.connected) {
      socket.emit(VOICE_SOCKET_EVENTS.leaveRoom, activeRoomRef.current);
    }

    resetRoomState();
  };

  const requestVoiceJoin = (
    roomId: string,
    localParticipant: VoiceParticipantPayload,
  ) =>
    new Promise<VoiceJoinResponse>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        reject(new Error("VOICE_JOIN_TIMEOUT"));
      }, VOICE_JOIN_TIMEOUT_MS);

      socket.emit(
        VOICE_SOCKET_EVENTS.joinRoom,
        roomId,
        localParticipant,
        (response: VoiceJoinResponse) => {
          window.clearTimeout(timeoutId);
          resolve(response);
        },
      );
    });

  const joinRoom = async ({ channelId, serverId }: VoiceRoomTarget) => {
    const roomId = buildVoiceRoomId(serverId, channelId);

    if (activeRoomRef.current === roomId || connectingRoomId === roomId) return;

    const userId = session?.user?.id;
    const userName = session?.user?.name;

    if (!userId || !userName) {
      setErrorKey("voice.auth-error");
      return;
    }

    setErrorKey(null);
    setConnectingRoomId(roomId);

    try {
      if (activeRoomRef.current && activeRoomRef.current !== roomId) {
        await leaveRoom();
      }

      await ensureSocketConnection();

      if (!socket.id) {
        throw new Error("Socket unavailable");
      }

      const stream = await getMicrophoneStream();

      microphoneStreamRef.current = stream;

      const localParticipant: VoiceParticipantPayload = {
        socketId: socket.id,
        userId,
        name: userName,
        avatar: session.user.image ?? null,
        muted: false,
      };

      upsertParticipant(localParticipant, true, stream);

      const response = await requestVoiceJoin(roomId, localParticipant);

      activeRoomRef.current = roomId;
      setActiveRoomId(roomId);
      setConnectingRoomId(null);

      response.participants.forEach((participant) => {
        upsertParticipant(participant, false, null);
      });

      for (const participant of response.participants) {
        await createOffer(roomId, participant);
      }
    } catch (joinError) {
      resetRoomState();

      const permissionState = await getMicrophonePermissionState();
      console.error("Failed to join voice room", joinError);
      setErrorKey(mapJoinError(joinError, permissionState));
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;

    microphoneStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });

    setIsMuted(nextMuted);

    if (socket.id) {
      updateParticipant(socket.id, (participant) => ({
        ...participant,
        muted: nextMuted,
      }));
    }

    if (activeRoomRef.current) {
      socket.emit(VOICE_SOCKET_EVENTS.participantState, activeRoomRef.current, {
        muted: nextMuted,
      });
    }
  };

  const toggleDeafen = () => {
    setIsDeafened((value) => !value);
  };

  useEffect(() => {
    const onParticipantJoined = ({ roomId: eventRoomId, participant }: VoiceParticipantEvent) => {
      if (eventRoomId !== activeRoomRef.current) return;
      if (participant.socketId === socket.id) return;

      upsertParticipant(participant, false, null);
    };

    const onParticipantLeft = ({ roomId: eventRoomId, socketId }: VoiceParticipantLeftEvent) => {
      if (eventRoomId !== activeRoomRef.current) return;

      peerConnectionsRef.current.get(socketId)?.close();
      peerConnectionsRef.current.delete(socketId);
      pendingCandidatesRef.current.delete(socketId);
      removeParticipant(socketId);
    };

    const onParticipantState = ({ roomId: eventRoomId, socketId, state }: VoiceParticipantStateEvent) => {
      if (eventRoomId !== activeRoomRef.current) return;

      updateParticipant(socketId, (participant) => ({
        ...participant,
        muted: state.muted,
      }));
    };

    const onVoiceSignal = async ({ roomId: eventRoomId, fromSocketId, participant, signal }: VoiceSignalEvent) => {
      if (eventRoomId !== activeRoomRef.current) return;

      upsertParticipant(participant, false, null);

      if (signal.type === "candidate") {
        const peerConnection = peerConnectionsRef.current.get(fromSocketId);

        if (peerConnection?.remoteDescription) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
          return;
        }

        const queuedCandidates = pendingCandidatesRef.current.get(fromSocketId) ?? [];
        queuedCandidates.push(signal.candidate);
        pendingCandidatesRef.current.set(fromSocketId, queuedCandidates);
        return;
      }

      const peerConnection = createPeerConnection(eventRoomId, participant);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(signal.description),
      );
      await flushPendingCandidates(fromSocketId);

      if (signal.type === "offer") {
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit(VOICE_SOCKET_EVENTS.signal, eventRoomId, fromSocketId, {
          type: "answer",
          description: answer,
        } satisfies VoiceSignalPayload);
      }
    };

    const onDisconnect = () => {
      if (!activeRoomRef.current) return;

      resetRoomState();
      setErrorKey("voice.connection-lost");
    };

    socket.on(VOICE_SOCKET_EVENTS.participantJoined, onParticipantJoined);
    socket.on(VOICE_SOCKET_EVENTS.participantLeft, onParticipantLeft);
    socket.on(VOICE_SOCKET_EVENTS.participantState, onParticipantState);
    socket.on(VOICE_SOCKET_EVENTS.signal, onVoiceSignal);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off(VOICE_SOCKET_EVENTS.participantJoined, onParticipantJoined);
      socket.off(VOICE_SOCKET_EVENTS.participantLeft, onParticipantLeft);
      socket.off(VOICE_SOCKET_EVENTS.participantState, onParticipantState);
      socket.off(VOICE_SOCKET_EVENTS.signal, onVoiceSignal);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    return () => {
      void leaveRoom();
    };
  }, []);

  return (
    <VoiceRoomContext.Provider
      value={{
        activeRoomId,
        connectingRoomId,
        errorKey,
        isDeafened,
        isMuted,
        joinRoom,
        leaveRoom,
        participants,
        toggleDeafen,
        toggleMute,
      }}
    >
      {children}
    </VoiceRoomContext.Provider>
  );
};