import { create } from "zustand";

export type SelectedReply = {
  id: string;
  content: string;
  username: string;
  avatar: string;
  mediaType: "text" | "image" | "video";
};

type ReplyStore = {
  selectedReply: SelectedReply | null;
  loadSelectedReply: (reply: SelectedReply) => void;
  clearSelectedReply: () => void;
};

export const useReplyStore = create<ReplyStore>()((set) => ({
  selectedReply: null,
  loadSelectedReply: (selectedReply) => set({ selectedReply }),
  clearSelectedReply: () => set({ selectedReply: null }),
}));
