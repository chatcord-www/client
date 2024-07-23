"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Folder, Hash } from "lucide-react";
import { useState } from "react";
import { ServerCategory } from "./category";
import { ServerChannel } from "./channel";
import { ChannelModal } from "./modals/channel-modal";
import { SidebarHeader, type SidebarHeaderProps } from "./sidebar-header";
import { Modals } from "./modals";

export const Sidebar = (props: SidebarHeaderProps) => {
  const [modal, setModal] = useState<"category" | "channel">("channel");

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="h-[calc(100vh-20px)] w-60">
          <SidebarHeader {...props} />
          <div className="mt-3">
            <ServerCategory
              categoryId="asd"
              name="important"
              serverId={props.serverId}
            >
              <ServerChannel
                channelId=""
                name="channeli"
                currentChannel="sd"
                serverId={props.serverId}
              />
              <ServerChannel
                channelId=""
                name="channeli-2"
                currentChannel="sd"
                serverId={props.serverId}
              />
              <ServerChannel
                channelId=""
                name="channeli-3"
                currentChannel="sd"
                serverId={props.serverId}
              />
            </ServerCategory>
          </div>
        </div>
      </ContextMenuTrigger>
      <Modals serverId={props.serverId} modal={modal}>
        <ContextMenuContent>
          <ContextMenuItem
            className="flex items-center gap-2"
            onClick={() => setModal("channel")}
          >
            <Hash size={16} className="text-zinc-400" />
            <span className="text-xs">Create Channel</span>
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center gap-2"
            onClick={() => setModal("category")}
          >
            <Folder size={16} className="text-zinc-400" />
            <span className="text-xs">Create Category</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </Modals>
    </ContextMenu>
  );
};
