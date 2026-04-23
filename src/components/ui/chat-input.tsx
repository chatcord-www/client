"use client";

import { Button } from "@/components/ui/button";
import { useOutSideClick } from "@/hooks/outside-click";
import { socket } from "@/lib/socket";
import { UploadMediaButton } from "@/components/pages/chat/actions/upload-media-button";
import { type SocketMessage } from "@/components/pages/chat/types/socket-message";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker, { EmojiStyle, type Theme } from "emoji-picker-react";
import { Gift, ImageIcon, Smile } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z, type ZodType } from "zod";
import { Input } from "./input";

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
  friendName,
}: ChatInputProps) => {
  const t = useTranslations("channel");
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  useOutSideClick(emojiRef, () => setShowEmojis(false));
  const { mutate: sendMessage, isPending } = api.sendMessage.useMutation();

  const { control, setValue, getValues, handleSubmit } = useForm<
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

  const onSubmit = ({ text }: TextareaFormType) => {
    if (!text || !text.trim()) return;

    if (!friendId && !(serverId && channelId)) {
      return;
    }

    sendMessage(
      { channelId, serverId, text, friendId },
      {
        onSuccess: (message: SocketMessage) => {
          setValue("text", "");
          emitNewMessage(message);
        },
      },
    );
  };

  if (currentUserId && friendId) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2 rounded-xl bg-[#11131a] px-3 py-2">
          <div className="relative size-8 shrink-0">
            <UploadMediaButton
              currentUserId={currentUserId}
              friendId={friendId}
              onUploaded={emitNewMessage}
              onUploadingChange={setIsUploading}
              className="left-0 top-0 flex size-8 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-200"
            />
          </div>

          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={isPending || isUploading}
                placeholder={`Message @${friendName ?? "unknown"}`}
                className="h-10 border-0 bg-transparent px-0 text-sm text-zinc-100 shadow-none ring-0 placeholder:text-zinc-500 focus-visible:ring-0"
              />
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-zinc-400"
          >
            <Gift className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-zinc-400"
          >
            <ImageIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-zinc-400"
          >
            <Smile className="size-4" />
          </Button>
        </div>
      </form>
    );
  }

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
      <div className="relative">
        <UploadMediaButton
          channelId={channelId}
          serverId={serverId}
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
                disabled={isUploading || isPending}
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
