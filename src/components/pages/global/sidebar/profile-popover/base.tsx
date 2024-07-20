"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { LocalesType } from "@/i18n";
import { Link } from "@/navigation";
import { enUS, ka } from "date-fns/locale";
import {
  ChevronRight,
  CircleSlash,
  Copy,
  Moon,
  Settings,
  Smile,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { PropsWithChildren, useMemo, useState } from "react";
import { Profile } from "../../profile";
import { ActivityProfilePopover } from "./activity";

export type USER_STATUS_ENUM = "ONLINE" | "IDLE" | "DND" | "OFFLINE";

export const BaseProfilePopover = ({
  locale,
  children,
}: PropsWithChildren<{ locale: LocalesType }>) => {
  const { data: session } = useSession();
  const [clientActivity, setClientActivity] = useState<USER_STATUS_ENUM>(
    session?.user.activity ?? "ONLINE",
  );
  const t = useTranslations();
  const currentLocale = locale === "en" ? enUS : ka;

  const userStatus = useMemo(() => {
    if (clientActivity === "ONLINE") {
      return (
        <>
          <div className="size-3 rounded-full bg-green-500" />
          <span>{t("status.online")}</span>
        </>
      );
    }

    if (clientActivity === "DND") {
      return (
        <>
          <CircleSlash className="text-red-500" size={16} />
          <span>{t("status.dnd")}</span>
        </>
      );
    }

    if (clientActivity === "IDLE") {
      return (
        <>
          <Moon className="text-yellow-500" size={16} />
          <span>{t("status.idle")}</span>
        </>
      );
    }

    if (clientActivity === "OFFLINE") {
      return (
        <>
          <div className="size-3 rounded-full border-4 border-zinc-500" />
          <span>{t("status.offline")}</span>
        </>
      );
    }
  }, [clientActivity]);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="relative overflow-hidden p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Profile {...session!} />
        <Separator className="mt-2" />
        <div className="flex flex-col pb-3">
          <ActivityProfilePopover
            activity={clientActivity}
            setActivity={setClientActivity}
          >
            <Button
              variant="ghost"
              className="relative justify-start gap-2 px-3 text-left text-xs focus:ring-0"
            >
              {userStatus}
              <ChevronRight className="absolute right-2" size={15} />
            </Button>
          </ActivityProfilePopover>
          <Button
            variant="ghost"
            className="justify-start gap-2 px-3 text-left text-xs"
          >
            <Smile size={16} />
            <span>{t("sidebar.profile-menu.set-custom-status")}</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-2 px-3 text-left text-xs"
          >
            <Copy size={16} />
            <span>{t("sidebar.profile-menu.copy-user-id")}</span>
          </Button>
          <Link href="/app/settings">
            <Button
              variant="ghost"
              className="w-80 justify-start gap-2 px-3 text-left text-xs"
            >
              <Settings size={16} />
              <span>{t("sidebar.profile-menu.settings")}</span>
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};
