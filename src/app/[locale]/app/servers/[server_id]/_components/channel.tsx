import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hash, Volume2 } from "lucide-react";
import { ChannelType } from "./sidebar-header";

type ServerChannelProps = ChannelType & {
  channelId: string;
  serverId: string | null;
  isSelected?: boolean;
};

export const ServerChannel = ({
  // channelId,
  // serverId,
  name,
  type,
  isSelected,
}: ServerChannelProps) => {
  return (
    <Button
      variant={"ghost"}
      className={cn(
        "flex w-full group items-center text-start justify-start gap-x-2 hover:bg-white/10 px-2 cursor-pointer transition-all rounded-sm py-1 justify-between!",
        isSelected && "bg-card",
      )}
    >
      {type === "TEXT" ? (
        <Hash size={15} className="text-zinc-400" />
      ) : (
        <Volume2 size={15} className="text-zinc-400" />
      )}
      <span className="text-sm text-zinc-400">{name}</span>
      {/* <Link
          href={`/servers/${serverId}/channel/${channelId}/settings`}
          className="group-hover:opacity-100 ml-auto opacity-0 transition-all"
        >
          <Settings size={14} className="text-zinc-400 hover:text-white" />
        </Link> */}
    </Button>
  );
};
