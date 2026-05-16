"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/trpc/react";
import EmojiPicker, { EmojiStyle, type Theme } from "emoji-picker-react";
import { Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

type MessageReactionsProps = {
  messageId: string;
  reactions: {
    id: string;
    emoji: string;
    count: number;
    reacted: boolean;
    users: {
      id: string;
      name: string | null;
      avatar: string | null;
    }[];
  }[];
};

export const MessageReactions = ({
  messageId,
  reactions,
}: MessageReactionsProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();
  const utils = api.useUtils();
  const { mutateAsync: addReaction, isPending } =
    api.addReaction.useMutation();

  const handleAddReaction = async (emoji: string) => {
    if (!emoji || isPending) return;

    try {
      await addReaction({ messageId, emoji });
      await utils.getMessages.invalidate();
      setShowPicker(false);
    } catch (error) {
      console.log("Failed to add/remove message reaction:", error);
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          onClick={() => handleAddReaction(reaction.emoji)}
          className={`rounded-full border px-2 py-0.5 text-sm transition ${
            reaction.reacted
              ? "border-blue-400/70 bg-blue-500/20 text-blue-100"
              : "border-zinc-600/70 bg-zinc-700/30 text-zinc-200 hover:border-zinc-400"
          }`}
          aria-label={`React with ${reaction.emoji}`}
        >
          <span>{reaction.emoji}</span>
          <span className="ml-1 text-xs">{reaction.count}</span>
        </button>
      ))}

      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-zinc-600/70 bg-zinc-800/40 px-2 py-1 text-zinc-300 transition hover:border-zinc-400 hover:text-zinc-100"
            aria-label="Add reaction"
          >
            <Plus size={14} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          sideOffset={10}
          collisionPadding={16}
          className="w-auto border-none bg-transparent p-0 shadow-none"
        >
          <EmojiPicker
            previewConfig={{}}
            theme={theme as Theme}
            emojiStyle={EmojiStyle.TWITTER}
            onEmojiClick={(emoji) => handleAddReaction(emoji.emoji)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
