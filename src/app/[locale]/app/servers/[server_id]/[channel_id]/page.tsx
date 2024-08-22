import { ChannelContainer } from "@/components/pages/channel/container";
import {
  ChannelWrapper,
  ChannelWrapperProps,
} from "@/components/pages/channel/wrapper";
import { MessagesProvider } from "@/components/providers/messages";
import { db } from "@/server/db";
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
