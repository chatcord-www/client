import { ChatInput } from "@/components/ui/chat-input";
import { db } from "@/server/db";

export default async function ChannelLayout({
  children,
  params,
}: React.PropsWithChildren<{
  params: {
    server_id: string;
    channel_id: string;
  };
}>) {
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
      <ChatInput channelName={channelInfo?.name as string} />
    </div>
  );
}
