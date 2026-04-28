"use client";

import { useOutSideClick } from "@/hooks/outside-click";
import { useChatTypingEmitter } from "@/hooks/chat-typing-emitter";
import { useReplyStore } from "@/hooks/use-reply-store";
import { socket } from "@/lib/socket";
import { UploadMediaButton } from "@/components/pages/chat/actions/upload-media-button";
import { type SocketMessage } from "@/components/pages/chat/types/socket-message";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker, { EmojiStyle, type Theme } from "emoji-picker-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z, type ZodType } from "zod";
import { Input } from "./input";
import { X } from "lucide-react";

type ChatInputProps = {
  channelName?: string | null;
  channelId?: string;
  serverId?: string;
  currentUserId?: string;
  friendId?: string;
  friendName?: string | null;
};

type TextareaFormType = {
  text: string;
};

export const TextareaFormSchema: ZodType<TextareaFormType> = z.object({
  text: z.string({ message: "required" }),
});

export const ChatInput = ({
  channelName,
  channelId,
  serverId,
  currentUserId,
  friendId,
}: ChatInputProps) => {
  const t = useTranslations("channel");
  const tMessage = useTranslations("channel.message");
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { onTextChangeTyping, stopTyping } = useChatTypingEmitter({
    channelId,
    serverId,
    currentUserId,
    friendId,
  });
  const { selectedReply, clearSelectedReply } = useReplyStore();
  useOutSideClick(emojiRef, () => setShowEmojis(false));
  const { mutate: sendMessage } = api.sendMessage.useMutation();

  const { control, setValue, getValues, handleSubmit, setFocus } = useForm<
    z.infer<typeof TextareaFormSchema>
  >({
    resolver: zodResolver(TextareaFormSchema),
    defaultValues: {
      text: "",
    },
  });

  const emitNewMessage = (message: SocketMessage) => {
    if (currentUserId && friendId) {
      socket.emit(
        "receive_direct_message",
        currentUserId,
        friendId,
        message,
    );
      return;
    }

    if (serverId && channelId) {
    socket.emit("receive_message", serverId, channelId, message);
    }
  };

  const onTextChange = (value: string) => {
    setValue("text", value);
    onTextChangeTyping(value);
  };

  const onSubmit = ({ text }: TextareaFormType) => {
    if (!text || !text.trim()) return;

    if (!friendId && !(serverId && channelId)) {
      return;
    }

    stopTyping();

    sendMessage(
      { channelId, serverId, text, friendId, replyToId: selectedReply?.id,  },
      {
        onSuccess: (message: SocketMessage) => {
          setValue("text", "");
          emitNewMessage(message);
          setFocus("text");
          clearSelectedReply();
        },
      },
    );
  };

  return (
    <>
      {showEmojis && (
        <div
          className="absolute right-4 bottom-0 -translate-y-16 "
          ref={emojiRef}
        >
          <EmojiPicker
            previewConfig={{}}
            theme={theme as Theme}
            emojiStyle={EmojiStyle.TWITTER}
            onEmojiClick={(emoji) =>
              setValue("text", `${getValues("text") + emoji.emoji}`)
            }
          />
        </div>
      )}
      {selectedReply && (
        <div className="mx-4 mt-2 p-2 bg-zinc-800/50 rounded flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-400">
              {tMessage("replying-to")} <span className="font-semibold text-zinc-300">{selectedReply.username}</span>
            </p>
            <p className="text-sm text-zinc-300 truncate">{selectedReply.content}</p>
          </div>
          <button
            onClick={clearSelectedReply}
            className="ml-2 p-1 hover:bg-zinc-700 rounded transition"
            type="button"
          >
            <X size={16} className="text-zinc-400" />
          </button>
        </div>
      )}
      <div className="relative">
        <UploadMediaButton
          channelId={channelId}
          serverId={serverId}
          currentUserId={currentUserId}
          friendId={friendId}
          onUploaded={emitNewMessage}
          onUploadingChange={setIsUploading}
        />
        <img
          onClick={() => setShowEmojis(true)}
          src="/assets/emoji.png"
          className="size-5 grayscale-100 group-hover:grayscale-0 absolute right-2 top-2 cursor-pointer"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onChange={(event) => onTextChange(event.target.value)}
                disabled={isUploading}
                className="pl-10"
                placeholder={t("textarea-placeholder", {
                  channel: channelName,
                })}
              />
            )}
          />
        </form>
      </div>
      {isUploading && (
        <p className="mt-1 text-xs text-zinc-400">{t("upload.uploading")}</p>
      )}
    </>
  );
};
