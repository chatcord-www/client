import { create } from "zustand";

export type ChannelType = {
  id: string;
  name: string | null;
  serverId: string | null;
  categoryId: string | null;
  type: "VOICE" | "TEXT" | null;
};

export type CategoryType = {
  id: string;
  name: string | null;
  serverId: string | null;
  channels: ChannelType[];
};

type CategoryChannels = {
  categories: CategoryType[];
  channelsWithoutCategory: ChannelType[];
  loadCategories: (categories: CategoryType[]) => void;
  loadChannelsWithoutCategory: (channels: ChannelType[]) => void;
  addChannelInCategory: (channels: ChannelType, categoryId: string) => void;
  addCategory: (category: CategoryType) => void;
  addChannelWithoutCategory: (channels: ChannelType) => void;
};

export const useCategoryChannels = create<CategoryChannels>()((set) => ({
  categories: [],
  channelsWithoutCategory: [],
  addCategory: (category) =>
    set((prev) => ({ categories: [...prev.categories, category] })),
  addChannelInCategory: (channel, categoryId) =>
    set((prev) => {
      const cloneCategories = [...prev.categories];
      const findCategoryIndex = prev.categories.findIndex(
        (category) => category.id === categoryId,
      );

      cloneCategories[findCategoryIndex]!.channels = [
        ...(cloneCategories[findCategoryIndex]?.channels as ChannelType[]),
        channel,
      ];

      return {
        categories: cloneCategories,
      };
    }),
  addChannelWithoutCategory: (channel) =>
    set((prev) => ({
      channelsWithoutCategory: [...prev.channelsWithoutCategory, channel]
    })),
  loadCategories: (categories) => set({ categories }),
  loadChannelsWithoutCategory: (channels) =>
    set({ channelsWithoutCategory: channels }),
}));
