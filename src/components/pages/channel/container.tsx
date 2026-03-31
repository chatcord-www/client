"use client";
import { ChatMessage, useChatMessages } from "@/hooks/chat-messages";
import { api } from "@/trpc/react";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
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
  const t = useTranslations("channel");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: apiMessages, isLoading } = api.getMessages.useQuery({
    channelId,
    serverId,
  });
  const { messages, loading, loadMessages, setLoading, clearMessages } = useChatMessages();

  useEffect(() => {
    clearMessages();
  }, [channelId, serverId]);

  useEffect(() => {
    if (apiMessages?.length) {
      loadMessages(apiMessages as ChatMessage[]);
    }
  }, [apiMessages]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="w-full flex-1 overflow-y-auto pb-2">
      {loading ? (
        <div className="space-y-3 p-4">
          {new Array(5).fill(null).map((_, index) => (
            <div
              key={index}
              className="bg-zinc-800/25 animate-pulse w-full h-16 rounded"
            />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
          {t("no-messages")}
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
