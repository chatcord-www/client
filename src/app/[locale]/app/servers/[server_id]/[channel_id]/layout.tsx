import { Textarea } from "@/components/ui/textarea";
import { db } from "@/server/db";
import { getTranslations } from "next-intl/server";
import React from "react";

export default async function ChannelLayout({
  children,
  params
}: React.PropsWithChildren<{
  params: {
    server_id: string;
    channel_id: string;
  };
}>) {
  const t = await getTranslations("channel");
  const channelInfo = await db.query.channels.findFirst({
    where: (channels, { eq, and }) =>
      and(
        eq(channels.serverId, params.server_id),
        eq(channels.id, params.channel_id),
      ),
  });

  return (
    <div className="w-full h-[calc(100vh-20px)] flex flex-col">
      <div>{children}</div>
      <Textarea
        className="mt-auto resize-none"
        placeholder={t("textarea-placeholder", { channel: channelInfo?.name })}
      />
    </div>
  );
}
