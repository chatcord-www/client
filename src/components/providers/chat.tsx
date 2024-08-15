"use client";
import { ChatContext, ChatContextProps } from "@/context/chat";
import { api } from "@/trpc/react";
import { PropsWithChildren, useContext } from "react";

type ChatProviderProps = {
  serverId: string;
  channelId: string;
};

export const useChatMessages = () => {
  const { messages, refetchChat, loading } = useContext(ChatContext);
  return { messages: messages || [], refetchChat, loading };
};

export const ChatProvider = ({
  children,
  channelId,
  serverId,
}: PropsWithChildren<ChatProviderProps>) => {
  const {
    data: messages,
    refetch,
    isLoading,
  } = api.getMessages.useQuery({
    channelId,
    serverId,
  });

  return (
    <ChatContext.Provider
      value={{
        loading: isLoading,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        refetchChat: refetch,
        messages: messages?.messages as ChatContextProps["messages"],
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
