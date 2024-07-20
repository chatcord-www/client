"use client";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";

export const Profile = ({ user }: Session) => {
  const t = useTranslations();

  return (
    <>
      <div className="relative overflow-hidden rounded-md pb-12">
        <div className="h-16 w-full bg-purple-400" />
        <img
          src={user.image!}
          className="absolute left-3 top-5 size-[90px] rounded-full border-[6px] border-popover"
        />
      </div>
      <div className="px-3 py-1">
        <h3 className="text-lg font-semibold truncate">{user.name}</h3>
        {user.aboutMe && (
          <>
            <Separator className="mt-2" />
            <div>
              <Label className="text-xs font-semibold uppercase">
                {t("sidebar.profile-menu.about-me")}
              </Label>
              <p className="break-words text-xs text-zinc-300">
                {user.aboutMe}
              </p>
            </div>
          </>
        )}
        <Separator className="mt-2" />
        <div>
          <Label className="text-xs font-semibold uppercase">
            {t("sidebar.profile-menu.member-since")}
          </Label>
          {user.createdAt && (
            <p className="break-words text-xs text-zinc-300">
              {t("sidebar.profile-menu.member-since-date", {
                date: format(user.createdAt, "PP"),
              })}
            </p>
          )}
        </div>
      </div>
    </>
  );
};
