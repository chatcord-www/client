"use client";

import { useChatMessages } from "@/hooks/chat-messages";
import { socket } from "@/lib/socket";
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
  user: {
    id: string;
    name: string;
    avatar: string;
  };
};

export const MessagesProvider = ({
  children,
  channelId,
  serverId,
  currentUserId,
  friendId,
}: React.PropsWithChildren<MessagesProvider>) => {
  const { addNewMessage } = useChatMessages();
  const [socketConnected, setSocketConnected] = useState<boolean>(
    socket.connected,
  );

  useEffect(() => {
    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);
    const messagePolling = (message: Message) => {
      addNewMessage(message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message_polling", messagePolling);
    socket.on("direct_message_polling", messagePolling);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message_polling", messagePolling);
      socket.off("direct_message_polling", messagePolling);
    };
  }, []);

  useEffect(() => {
    if (!socketConnected) return;

    if (serverId && channelId) {
    socket.emit("connect_guild", serverId, channelId);
    }

    if (currentUserId && friendId) {
      socket.emit("connect_direct", currentUserId, friendId);
    }
  }, [socketConnected, serverId, channelId, currentUserId, friendId]);

  return <>{children}</>;
};
