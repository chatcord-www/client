import { ChannelContainer } from "@/components/pages/channel/container";
import { VoiceRoom } from "@/components/pages/channel/voice-room";
import {
  ChannelWrapper,
  ChannelWrapperProps,
} from "@/components/pages/channel/wrapper";
import { MessagesProvider } from "@/components/providers/messages";
import { db } from "@/server/db";

export default async function ChannelPage(props: {
  params: { server_id: string; channel_id: string };
}) {
  const channelInfo = await db.query.channels.findFirst({
    where: (channels, { eq, and }) =>
      and(
        eq(channels.serverId, props.params.server_id),
        eq(channels.id, props.params.channel_id),
      ),
  });

  if (!channelInfo) {
    return null;
  }

  if (channelInfo.type === "VOICE") {
    return (
      <ChannelWrapper {...(channelInfo as ChannelWrapperProps)}>
        <VoiceRoom
          channelId={props.params.channel_id}
          serverId={props.params.server_id}
        />
      </ChannelWrapper>
    );
  }

  return (
    <MessagesProvider
      channelId={props.params.channel_id}
      serverId={props.params.server_id}
    >
      <ChannelWrapper {...(channelInfo as ChannelWrapperProps)}>
        <ChannelContainer
          channelId={props.params.channel_id}
          serverId={props.params.server_id}
        />
      </ChannelWrapper>
    </MessagesProvider>
  );
}
