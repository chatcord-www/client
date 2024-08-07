"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { type ServerType, useServers } from "@/hooks/servers";
import { LocalesType } from "@/i18n";
import { useEffect } from "react";
import { CreateServerDialog } from "./dialogs/create-server-dialog";
import { DiscoverServersBtn } from "./discover-servers-btn";
import { DmButton } from "./dm-btn";
import { ProfileIcon } from "./profile-icon";
import { ServerIcon } from "./server-icon";

type SidebarProps = {
  servers: ServerType[];
  locale: LocalesType;
};

export const Sidebar = ({ locale, servers }: SidebarProps) => {
  const { loadServers, servers: serversList } = useServers();

  useEffect(() => {
    loadServers(servers)
  }, [servers]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex min-h-screen flex-col items-center bg-zinc-900/10 px-2 py-2">
        <DmButton />
        <div className="my-2 h-px w-full bg-white/5" />
        {serversList && (
          <div className="flex flex-col gap-2">
            {serversList.map((server) => (
              <ServerIcon {...server} key={server.id} />
            ))}
            <div className="my-2 h-px w-full bg-white/5" />
          </div>
        )}

        <CreateServerDialog />
        <DiscoverServersBtn />
        <div className="mt-auto">
          <ProfileIcon locale={locale} />
        </div>
      </div>
    </TooltipProvider>
  );
};
