"use client";
import { GeistMono } from "geist/font/mono";
import { Hash, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";

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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="shrink-0">
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
      </div>
      {children}
    </div>
  );
};
