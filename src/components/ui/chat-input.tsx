"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker, { EmojiStyle, type Theme } from "emoji-picker-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Controller, useForm } from "react-hook-form";
import { z, type ZodType } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Textarea } from "./textarea";

type ChatInputProps = {
  channelName: string;
};

type TextareaFormType = {
  text: string;
};

export const TextareaFormSchema: ZodType<TextareaFormType> = z.object({
  text: z.string({ message: "required" }),
});

export const ChatInput = ({ channelName }: ChatInputProps) => {
  const t = useTranslations("channel");
  const { theme } = useTheme();

  const { control, setValue, getValues } = useForm<
    z.infer<typeof TextareaFormSchema>
  >({
    resolver: zodResolver(TextareaFormSchema),
    defaultValues: {
      text: "",
    },
  });

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger className="absolute right-2 top-2 cursor-pointer">
          <img src="/assets/emoji.png" className="size-6 grayscale-100" />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto"
          style={{
            padding: 0,
          }}
        >
          <EmojiPicker
            previewConfig={{}}
            theme={theme as Theme}
            emojiStyle={EmojiStyle.TWITTER}
            onEmojiClick={(emoji) =>
              setValue("text", `${getValues("text") + emoji.emoji}`)
            }
          />
        </PopoverContent>
      </Popover>
      <Controller
        name="text"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            className="mt-auto resize-none"
            placeholder={t("textarea-placeholder", { channel: channelName })}
          />
        )}
      />
    </div>
  );
};
