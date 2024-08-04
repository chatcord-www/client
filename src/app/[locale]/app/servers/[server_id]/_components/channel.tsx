import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { Hash, Settings } from "lucide-react";
import { Metadata } from "next";

type ServerChannelProps = {
  name: string;
  channelId: string;
  serverId: string;
  currentChannel: string;
};

const generateMetadata = (): Metadata => {
  return {
    title: 'channel'
  }
}

export const ServerChannel = ({
  channelId,
  serverId,
  name,
}: ServerChannelProps) => {

  return (
    <Button
      variant={"ghost"}
      className="flex w-full group items-center text-start justify-start gap-x-2 hover:bg-white/10 px-2 cursor-pointer transition-all rounded-sm py-1 justify-between!"
    >
      <Hash size={15} className="text-zinc-400" />
      <span className="text-sm text-zinc-400">{name}</span>
      <Link
        href={`/servers/${serverId}/channel/${channelId}/settings`}
        className="group-hover:opacity-100 ml-auto opacity-0 transition-all"
      >
        <Settings size={14} strokeWidth={1} className="text-zinc-400"/>
      </Link>
    </Button>
  );
};
