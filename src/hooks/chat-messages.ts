import { create } from "zustand";

export type ChatMessage = {
  content: string;
  id: string;
  createdAt: Date,
  editedAt?: Date;
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

type ChatMessages = {
  messages: ChatMessage[];
  loading: boolean;
  setLoading: (value: boolean) => void;
  loadMessages: (messages: ChatMessage[]) => void;
  addNewMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
};

export const useChatMessages = create<ChatMessages>()((set) => ({
  loading: true,
  messages: [],
  setLoading: (loading) => set({ loading }),
  addNewMessage: (message) =>
    set((prev) => ({ messages: [...prev.messages, message] })),
  loadMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [] }),
}));
