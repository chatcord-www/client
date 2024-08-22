import { createContext } from "react";

export type ChatContextProps = {
  loading: boolean;
  messages: {
    channelId: string;
    serverId: string;
    id: string;
    createdAt: Date;
    content: string;
    userId: string;
    users: {
      name: string;
      image: string;
    };
  }[];
};

export const ChatContext = createContext<ChatContextProps>({
  loading: false,
  messages: [],
});
