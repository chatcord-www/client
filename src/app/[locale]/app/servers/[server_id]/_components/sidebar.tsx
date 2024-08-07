"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Link } from "@/navigation";
import { Folder, Hash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ServerCategory } from "./category";
import { ServerChannel } from "./channel";
import { Modals } from "./modals";
import { SidebarHeader, type SidebarHeaderProps } from "./sidebar-header";

export const Sidebar = (props: SidebarHeaderProps) => {
  const [modal, setModal] = useState<"category" | "channel">("channel");
  const [open, setOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState("");
  const t = useTranslations("modals");
  const params = useParams();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="h-[calc(100vh-20px)] w-60 mr-2">
          <SidebarHeader {...props} />
          <div className="mt-3">
            {props.categories.map((category) => (
              <ServerCategory
                key={category.id}
                name={category.name as string}
                serverId={props.serverId}
                categoryId={category.id}
              >
                {category.channels.map((channel) => (
                  <Link
                    href={`/app/servers/${props.serverId}/${channel.id}`}
                    key={channel.id}
                  >
                    <ServerChannel
                      isSelected={params.channel_id === channel.id}
                      channelId={channel.id}
                      {...channel}
                    />
                  </Link>
                ))}
              </ServerCategory>
            ))}
            {props.channelsWithoutCategory.map((channel) => (
              <Link
                href={`/app/servers/${props.serverId}/${channel.id}`}
                key={channel.id}
              >
                <ServerChannel
                  isSelected={params.channel_id === channel.id}
                  channelId={channel.id}
                  {...channel}
                />
              </Link>
            ))}
          </div>
        </div>
      </ContextMenuTrigger>
      <Modals
        onCategorySelect={setCurrentCategoryId}
        categoryId={currentCategoryId}
        modal={modal}
        open={open}
        setOpen={setOpen}
        serverId={props.serverId}
      >
        <ContextMenuContent>
          <ContextMenuItem
            className="flex items-center gap-2"
            onClick={() => setModal("channel")}
          >
            <Hash size={16} className="text-zinc-400" />
            <span className="text-xs">{t("channel.title")}</span>
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center gap-2"
            onClick={() => setModal("category")}
          >
            <Folder size={16} className="text-zinc-400" />
            <span className="text-xs">{t("category.title")}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </Modals>
    </ContextMenu>
  );
};
