"use client";
import { ChatMessage, useChatMessages } from "@/hooks/chat-messages";
import { api } from "@/trpc/react";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Message } from "../chat/message";

type ChannelContainerProps = {
  serverId: string;
  channelId: string;
};

export const ChannelContainer = ({
  channelId,
  serverId,
}: ChannelContainerProps) => {
  const { data: session } = useSession();
  const { data: apiMessages, isLoading } = api.getMessages.useQuery({
    channelId,
    serverId,
  });
  const { messages, loading, loadMessages, setLoading } = useChatMessages();  

  useEffect(() => {
    if (apiMessages?.length) {
      loadMessages(apiMessages as ChatMessage[]);      
    }
  }, [apiMessages]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <div className="w-full h-[calc(100vh-210px)] pb-2">
      {loading ? (
        <div className="space-y-3">
          {new Array(5).fill(null).map((_, index) => (
            <div
              key={index}
              className="bg-zinc-800/25 animate-pulse w-full h-16"
            />
          ))}
        </div>
      ) : (
        messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            avatar={message.user?.avatar}
            createdAt={message.createdAt}
            message={message.content}
            userId={message.user.id}
            username={message.user?.name}
            session={session as Session}
          />
        ))
      )}
    </div>
  );
};
