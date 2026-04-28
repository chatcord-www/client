"use client";

import { useChatMessages } from "@/hooks/chat-messages";
import { useChatTyping } from "@/hooks/chat-typing";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type MessagesProvider = {
  channelId?: string;
  serverId?: string;
  currentUserId?: string;
  friendId?: string;
};

type Message = {
  content: string;
  id: string;
  createdAt: Date;
  replyToId?: string;
  replyTo?: {
    id: string;
    content: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  } | null;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
};

type TypingPayload = {
  userId: string;
  userName: string;
  isTyping: boolean;
};

export const MessagesProvider = ({
  children,
  channelId,
  serverId,
  currentUserId,
  friendId,
}: React.PropsWithChildren<MessagesProvider>) => {
  const { data: session } = useSession();
  const { addNewMessage } = useChatMessages();
  const { addTypingUser, removeTypingUser } = useChatTyping();
  const [socketConnected, setSocketConnected] = useState<boolean>(
    socket.connected,
  );
  const activeUserId = currentUserId ?? session?.user?.id;

  useEffect(() => {
    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);
    const messagePolling = (message: Message) => {
      removeTypingUser(message.user.id);
      addNewMessage(message);
    };
    const typingPolling = (payload: TypingPayload) => {
      if (payload.userId === activeUserId) return;

      if (payload.isTyping) {
        addTypingUser({ id: payload.userId, name: payload.userName });
        return;
      }

      removeTypingUser(payload.userId);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message_polling", messagePolling);
    socket.on("direct_message_polling", messagePolling);
    socket.on("typing_polling", typingPolling);
    socket.on("direct_typing_polling", typingPolling);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message_polling", messagePolling);
      socket.off("direct_message_polling", messagePolling);
      socket.off("typing_polling", typingPolling);
      socket.off("direct_typing_polling", typingPolling);
    };
  },);

  useEffect(() => {
    if (!(socketConnected || socket.connected)) return;

    if (serverId && channelId) {
    socket.emit("connect_guild", serverId, channelId);
    }

    if (currentUserId && friendId) {
      socket.emit("connect_direct", currentUserId, friendId);
    }
  }, [socketConnected, serverId, channelId, currentUserId, friendId]);

  return <>{children}</>;
};
