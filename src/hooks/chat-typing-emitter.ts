import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

type UseChatTypingEmitterProps = {
  channelId?: string;
  serverId?: string;
  currentUserId?: string;
  friendId?: string;
};

export const useChatTypingEmitter = ({
  channelId,
  serverId,
  currentUserId,
  friendId,
}: UseChatTypingEmitterProps) => {
  const { data: session } = useSession();
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeUserId = currentUserId ?? session?.user?.id;
  const activeUserName = session?.user?.name ?? "turbooov8";

  const emitTyping = (isTyping: boolean) => {
    if (!activeUserId) return;
    if (isTypingRef.current === isTyping) return;

    isTypingRef.current = isTyping;
    const payload = {
      userId: activeUserId,
      userName: activeUserName,
      isTyping,
    };

    if (currentUserId && friendId) {
      socket.emit("typing_direct", currentUserId, friendId, payload);
      return;
    }

    if (serverId && channelId) {
      socket.emit("typing_guild", serverId, channelId, payload);
    }
  };

  const scheduleStopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1000);
  };

  const onTextChangeTyping = (value: string) => {
    if (!value.trim()) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      emitTyping(false);
      return;
    }

    emitTyping(true);
    scheduleStopTyping();
  };

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    emitTyping(false);
  };

  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, []);

  return {
    onTextChangeTyping,
    stopTyping,
  };
};