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
import { Modals } from "./modals";
import { SidebarHeader, type SidebarHeaderProps } from "./sidebar-header";
import { useTranslations } from "next-intl";

export const Sidebar = (props: SidebarHeaderProps) => {
  const [modal, setModal] = useState<"category" | "channel">("channel");
  const [open, setOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState("");
  const t = useTranslations('modals') 

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="h-[calc(100vh-20px)] w-60">
          <SidebarHeader {...props} />
          <div className="mt-3">
            {props.categories.map((category) => (
              <ServerCategory
                key={category.id}
                name={category.name as string}
                serverId={props.serverId}
                categoryId={category.id}
              ></ServerCategory>
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
            <span className="text-xs">{t('channel.title')}</span>
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center gap-2"
            onClick={() => setModal("category")}
          >
            <Folder size={16} className="text-zinc-400" />
            <span className="text-xs">{t('category.title')}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </Modals>
    </ContextMenu>
  );
};
