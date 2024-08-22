"use client";

import { useChatMessages } from "@/hooks/chat-messages";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";

type MessagesProvider = {
  channelId: string;
  serverId: string;
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
    socket.on(`message_polling`, messagePolling);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message_polling", messagePolling);
    };
  }, []);

  useEffect(() => {
    if (!socketConnected) return;
    socket.emit("connect_guild", serverId, channelId);
  }, []);

  return <>{children}</>;
};
