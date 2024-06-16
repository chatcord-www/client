import DiscordSignOutButton from "@/components/pages/main/sign-out";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@/navigation";
import { headers } from "next/headers";
import { PropsWithChildren } from "react";

const routes = [
  { name: "Profile", route: "profile" },
  { name: "Privacy & Safety", route: "privacy" },
  { name: "Connections", route: "connections" },
  { name: "Devices", route: "devices" },
] as const;

export default async function SettingsLayout({ children }: PropsWithChildren) {
  const referer = headers().get("referer");
  const currentRoute = referer?.split("/settings/")[1];

  console.log({ currentRoute });

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-start md:gap-14">
        <div>
          <Label className="relative left-4 text-sm uppercase text-slate-300">
            User Settings
          </Label>
          <div className="mt-2 flex flex-col">
            {routes.map(({ name, route }) => (
              <Link href={`/app/settings/${route}`} key={route}>
                <Button
                  variant={route === currentRoute ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  {name}
                </Button>
              </Link>
            ))}
            <DiscordSignOutButton buttonText="Sign Out" />
          </div>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
