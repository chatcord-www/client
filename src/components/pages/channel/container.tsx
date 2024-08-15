"use client";
import { useChatMessages } from "@/components/providers/chat";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Message } from "../chat/message";

export const ChannelContainer = () => {
  const { data: session } = useSession();
  const { messages, loading } = useChatMessages();

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
            avatar={message.users?.image}
            createdAt={message.createdAt}
            message={message.content}
            userId={message.userId}
            username={message.users?.name}
            session={session as Session}
          />
        ))
      )}
    </div>
  );
};
