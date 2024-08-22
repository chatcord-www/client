"use client";

import { useChatMessages } from "@/hooks/chat-messages";
import { useOutSideClick } from "@/hooks/outside-click";
import { socket } from "@/lib/socket";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker, { EmojiStyle, type Theme } from "emoji-picker-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z, type ZodType } from "zod";
import { Input } from "./input";

type ChatInputProps = {
  channelName: string;
  channelId: string;
  serverId: string;
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
}: ChatInputProps) => {
  const t = useTranslations("channel");
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  useOutSideClick(emojiRef, () => setShowEmojis(false));
  const { mutate: sendMessage } = api.sendMessage.useMutation();
  const { addNewMessage } = useChatMessages();

  const { control, setValue, getValues, handleSubmit } = useForm<
    z.infer<typeof TextareaFormSchema>
  >({
    resolver: zodResolver(TextareaFormSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = ({ text }: TextareaFormType) => {
    sendMessage(
      { channelId, serverId, text },
      {
        onSuccess: (message) => {
          setValue("text", "");
          socket.emit("receive_message", serverId, channelId, message);
          addNewMessage(message);
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
      <div className="relative">
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
                placeholder={t("textarea-placeholder", {
                  channel: channelName,
                })}
              />
            )}
          />
        </form>
      </div>
    </>
  );
};
