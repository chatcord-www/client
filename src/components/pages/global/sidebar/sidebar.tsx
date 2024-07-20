"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocalesType } from "@/i18n";
import { CreateServerDialog } from "./dialogs/create-server-dialog";
import { DiscoverServersBtn } from "./discover-servers-btn";
import { DmButton } from "./dm-btn";
import { ProfileIcon } from "./profile-icon";
import { ServerIcon } from "./server-icon";

type SidebarProps = {
  servers: {
    id: string;
    name: string | null;
    icon: string | null;
    public: boolean | null;
    ownerId: string;
  }[];
  locale: LocalesType;
};

export const Sidebar = ({ locale, servers }: SidebarProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex min-h-screen flex-col items-center bg-zinc-900/10 px-2 py-2">
        <DmButton />
        <div className="my-2 h-px w-full bg-white/5" />
        {servers && (
          <div className="flex flex-col gap-2">
            {servers.map((server) => (
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
