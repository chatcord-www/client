"use client";
import { Smile, Copy, CircleSlash, Moon, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { PropsWithChildren, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { enUS, ka } from "date-fns/locale";
import { format } from "date-fns";
import { LocalesType } from "@/i18n";
import { useTranslations } from "next-intl";
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
        <div className="pb-12">
          <div className="h-16 w-full bg-purple-400" />
          <img
            src={session?.user.image ?? ""}
            className="absolute left-3 top-5 size-[90px] rounded-full border-[6px] border-popover"
          />
        </div>
        <div className="px-3 py-1">
          <h3 className="text-lg font-semibold">{session?.user.name}</h3>
          {session?.user.aboutMe && (
            <>
              <Separator className="mt-2" />
              <div>
                <Label className="text-xs font-semibold uppercase">
                  {t("sidebar.profile-menu.about-me")}
                </Label>
                <p className="break-words text-xs text-zinc-300">
                  {session?.user.aboutMe}
                </p>
              </div>
            </>
          )}
          <Separator className="mt-2" />
          <div>
            <Label className="text-xs font-semibold uppercase">
              {t("sidebar.profile-menu.member-since")}
            </Label>
            {session?.user.createdAt && (
              <p className="break-words text-xs text-zinc-300">
                {t("sidebar.profile-menu.member-since-date", {
                  date: format(session.user.createdAt, "PP", {
                    locale: currentLocale,
                  }),
                })}
              </p>
            )}
          </div>
          <Separator className="mt-2" />
        </div>
        <div className="flex flex-col pb-3">
          <ActivityProfilePopover
            activity={clientActivity}
            setActivity={setClientActivity}
          >
            <Button
              variant="ghost"
              className="justify-start gap-2 px-3 text-left text-xs relative focus:ring-0"
            >
              {userStatus}
              <ChevronRight className="absolute right-2" size={15}/>
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
        </div>
      </PopoverContent>
    </Popover>
  );
};
