import { TooltipProvider } from "@/components/ui/tooltip";
import { DmButton } from "./dm-btn";
import { CreateServerButton } from "./create-server-btn";
import { ServerIcon, ServerIconProps } from "./server-icon";
import { DiscoverServersBtn } from "./discover-servers-btn";
import { ProfileIcon } from "./profile-icon";
import { LocalesType } from "@/i18n";

const servers: ServerIconProps[] = [
  {
    id: "123123",
    image: "",
    name: "chemi kleoba server",
  },
];

export const Sidebar = ({ locale }: { locale: LocalesType }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex min-h-screen flex-col items-center bg-zinc-900/10 px-2 py-2">
        <DmButton />
        <div className="my-2 h-px w-full bg-white/5" />
        {servers && (
          <>
            {servers.map((server) => (
              <ServerIcon {...server} key={server.id} />
            ))}
            <div className="my-2 h-px w-full bg-white/5" />
          </>
        )}

        <CreateServerButton />
        <DiscoverServersBtn />
        <div className="mt-auto">
          <ProfileIcon locale={locale} />
        </div>
      </div>
    </TooltipProvider>
  );
};
