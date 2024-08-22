import { create } from "zustand";

export type ChatMessage = {
  content: string;
  id: string;
  createdAt: Date,
  user: {
    id: string;
    name: string;
    avatar: string;
  };
};

type ChatMessages = {
  messages: ChatMessage[];
  loading: boolean;
  setLoading: (value: boolean) => void;
  loadMessages: (messages: ChatMessage[]) => void;
  addNewMessage: (message: ChatMessage) => void;
};

export const useChatMessages = create<ChatMessages>()((set) => ({
  loading: true,
  messages: [],
  setLoading: (loading) => set({ loading }),
  addNewMessage: (message) =>
    set((prev) => ({ messages: [...prev.messages, message] })),
  loadMessages: (messages) => set({ messages }),
}));
