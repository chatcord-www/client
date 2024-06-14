"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { LocalesType } from "@/i18n";
import { BaseProfilePopover } from "./profile-popover/base";

export type USER_STATUS_ENUM = "ONLINE" | "IDLE" | "DND" | "OFFLINE";

export const ProfileIcon = ({ locale }: { locale: LocalesType }) => {
  const { data: session } = useSession();

  return (
    <BaseProfilePopover locale={locale}>
      <Avatar className="cursor-pointer">
        {session?.user.image && (
          <AvatarImage src={session?.user.image} alt="niko" />
        )}
        <AvatarFallback>{session?.user.name?.[0]}</AvatarFallback>
      </Avatar>
    </BaseProfilePopover>
  );
};
