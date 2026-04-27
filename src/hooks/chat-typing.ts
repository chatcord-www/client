import { create } from "zustand";

export type TypingUser = {
  id: string;
  name: string;
};

type ChatTyping = {
  typingUsers: TypingUser[];
  addTypingUser: (user: TypingUser) => void;
  removeTypingUser: (userId: string) => void;
};

export const useChatTyping = create<ChatTyping>()((set) => ({
  typingUsers: [],
  addTypingUser: (user) =>
    set((state) => {
      const exists = state.typingUsers.some((typingUser) => typingUser.id === user.id);

      if (exists) {
        return {
          typingUsers: state.typingUsers.map((typingUser) =>
            typingUser.id === user.id ? user : typingUser,
          ),
        };
      }

      return { typingUsers: [...state.typingUsers, user] };
    }),
  removeTypingUser: (userId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((typingUser) => typingUser.id !== userId),
    })),
}));