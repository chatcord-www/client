import { ChatInput } from "@/components/ui/chat-input";
import { TypingIndicatorBar } from "@/components/pages/chat/typing-indicator/typing-indicator-bar";
import { MembersList } from "@/components/pages/channel/members-list";
import { db } from "@/server/db";

type Props = {
  params: {
    server_id: string;
    channel_id: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const channelInfo = await db.query.channels.findFirst({
    where: (channels, { eq, and }) =>
      and(
        eq(channels.serverId, params.server_id),
        eq(channels.id, params.channel_id),
      ),
    with: {
      server: {
        columns: {
          name: true,
        },
      },
    },
  });

  return {
    title: `• Chat | #${channelInfo?.name} | ${channelInfo?.server?.name}`,
  };
}

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
    <div className="w-full h-[calc(100vh-20px)] flex">
      <div className="flex-1 flex flex-col min-w-0">
      <div className="flex-1 overflow-hidden">{children}</div>
      <div className="px-4 pb-1">
        <TypingIndicatorBar />
      </div>
      <ChatInput
        channelName={channelInfo?.name as string}
        channelId={params.channel_id}
        serverId={params.server_id}
      />
      </div>
      <MembersList serverId={params.server_id} />
    </div>
  );
}
