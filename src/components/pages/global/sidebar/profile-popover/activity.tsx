"use client";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleSlash, Moon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { USER_STATUS_ENUM } from "./base";

type ActivityProfilePopoverProps = {
  activity: USER_STATUS_ENUM;
  setActivity: (value: USER_STATUS_ENUM) => void;
};

export const ActivityProfilePopover = ({
  children,
  activity,
  setActivity,
}: PropsWithChildren<ActivityProfilePopoverProps>) => {
  const t = useTranslations();

  const activityOnChange = (value: USER_STATUS_ENUM) => {
    setActivity(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="p-0">
        <DropdownMenuCheckboxItem
          className="space-x-2 px-5 text-xs"
          checked={activity === "ONLINE"}
          onCheckedChange={() => activityOnChange("ONLINE")}
        >
          <div className="size-3 rounded-full bg-green-500" />
          <span>{t("status.online")}</span>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="space-x-2 px-5 text-xs"
          checked={activity === "DND"}
          onCheckedChange={() => activityOnChange("DND")}
        >
          <CircleSlash className="text-red-500" size={16} />
          <span>{t("status.dnd")}</span>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="space-x-2 px-5 text-xs"
          checked={activity === "IDLE"}
          onCheckedChange={() => activityOnChange("IDLE")}
        >
          <Moon className="text-yellow-500" size={16} />
          <span>{t("status.idle")}</span>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="space-x-2 px-5 text-xs"
          checked={activity === "OFFLINE"}
          onCheckedChange={() => activityOnChange("OFFLINE")}
        >
          <div className="size-3 rounded-full border-4 border-zinc-500" />
          <span>{t("status.offline")}</span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
