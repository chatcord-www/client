"use client";
import { Button } from "@/components/ui/button";
import DiscordSignOutButton from "@/components/pages/main/sign-out";
import SettingsDescription from "./settings-description";

export default function SettingsPage() {
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-start gap-4 md:gap-14">
        <div className="grid">
          <p className="uppercase text-slate-300">User Settings</p>
          <Button variant="ghost" className="justify-start dark:focus:bg-gray-800 focus:bg-gray-300">
            My Account
          </Button>
          <Button variant="ghost" className="justify-start dark:focus:bg-gray-800 focus:bg-gray-300">
            Profiles
          </Button>
          <Button variant="ghost" className="justify-start dark:focus:bg-gray-800 focus:bg-gray-300">
            Privacy & Safety
          </Button>
          <Button variant="ghost" className="justify-start dark:focus:bg-gray-800 focus:bg-gray-300">
            Family Center
          </Button>
          <Button variant="ghost" className="justify-start dark:focus:bg-gray-800 focus:bg-gray-300">
            Authorized Apps
          </Button>
          <Button variant="ghost" className="justify-start dark:focus:bg-gray-800 focus:bg-gray-300">
            Devices
          </Button>
          <Button variant="ghost" className="justify-start dark:focus:bg-gray-800 focus:bg-gray-300">
            Connections
          </Button>
         <DiscordSignOutButton buttonText="Sign Out" />
        </div>
        <div className="w-full">
          <SettingsDescription />
        </div>
      </div>
    </div>
  );
}
