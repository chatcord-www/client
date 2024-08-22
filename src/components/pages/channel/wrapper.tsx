"use client";
import { useChatMessages } from "@/hooks/chat-messages";
import { GeistMono } from "geist/font/mono";
import { Hash, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PropsWithChildren, useEffect, useRef } from "react";

export type ChannelWrapperProps = {
  id: string;
  name: string | null;
  serverId: string | null;
  categoryId: string | null;
  type: "VOICE" | "TEXT" | null;
};

export const ChannelWrapper = ({
  children,
  type,
  name,
}: PropsWithChildren<ChannelWrapperProps>) => {
  const t = useTranslations("channel");
  const ref = useRef<HTMLDivElement>(null);
  const { loading } = useChatMessages();

  useEffect(() => {
    if (!loading) {
      ref.current!.scrollTop = ref.current?.scrollHeight as number;
    }
  }, [loading]);

  

  return (
    <div className="w-full overflow-y-auto" ref={ref}>
      <div className="bg-card size-12 rounded-full grid place-items-center ml-4 mt-4">
        {type === "TEXT" ? (
          <Hash size={20} strokeWidth={3} className="text-zinc-300" />
        ) : (
          <Volume2 size={20} strokeWidth={3} className="text-zinc-300" />
        )}
      </div>
      <div className="mt-3 cursor-default p-4">
        <h1 style={GeistMono.style} className="font-black text-2xl">
          {t("welcome", { channel: name })}
        </h1>
        <p className="text-sm text-white/55">
          {t("description", { channel: name })}
        </p>
      </div>
      {children}
    </div>
  );
};
