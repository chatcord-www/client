import { ChannelContainer } from "@/components/pages/channel/container";
import { db } from "@/server/db";
import { format } from "date-fns";
import { GeistMono } from "geist/font/mono";
import { Hash, Volume2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ChannelPage(props: {
  params: { server_id: string; channel_id: string };
}) {
  const t = await getTranslations("channel");

  const channelInfo = await db.query.channels.findFirst({
    where: (channels, { eq, and }) =>
      and(
        eq(channels.serverId, props.params.server_id),
        eq(channels.id, props.params.channel_id),
      ),
  });

  return (
    <div className="w-full overflow-y-auto">
      <div className="bg-card size-12 rounded-full grid place-items-center ml-4 mt-4">
        {channelInfo?.type === "TEXT" ? (
          <Hash size={20} strokeWidth={3} className="text-zinc-300" />
        ) : (
          <Volume2 size={20} strokeWidth={3} className="text-zinc-300" />
        )}
      </div>
      <div className="mt-3 cursor-default p-4">
        <h1 style={GeistMono.style} className="font-black text-2xl">
          {t("welcome", { channel: channelInfo?.name })}
        </h1>
        <p className="text-sm text-white/55">
          {t("description", { channel: channelInfo?.name })}
        </p>
      </div>
      {/* <div className="bg-white/10 w-full my-3 h-px text-center flex items-center justify-center text-xs">
        <time className="px-2 bg-background text-white/50 cursor-default select-none">
          {format(new Date(), "PPP")}
        </time>
      </div> */}
      <ChannelContainer />
    </div>
  );
}
