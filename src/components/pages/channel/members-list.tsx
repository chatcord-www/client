"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";

type MembersListProps = {
  serverId: string;
};

const activityColors: Record<string, string> = {
  ONLINE: "bg-green-500",
  IDLE: "bg-yellow-500",
  DND: "bg-red-500",
  OFFLINE: "bg-zinc-500",
};

export const MembersList = ({ serverId }: MembersListProps) => {
  const t = useTranslations("members");
  const { data: members, isLoading } = api.server.getMembers.useQuery({
    serverId,
  });

  if (isLoading) {
    return (
      <div className="w-60 shrink-0 p-3 space-y-3">
        {new Array(3).fill(null).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!members?.length) return null;

  const online = members.filter((m) => m.activity !== "OFFLINE");
  const offline = members.filter((m) => m.activity === "OFFLINE");

  return (
    <div className="w-60 shrink-0 overflow-y-auto h-full border-l border-white/5 p-3">
      {online.length > 0 && (
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase mb-2">
            {t("online")} — {online.length}
          </h3>
          {online.map((member) => (
            <MemberItem key={member.id} member={member} />
          ))}
        </div>
      )}
      {offline.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase mb-2">
            {t("offline")} — {offline.length}
          </h3>
          {offline.map((member) => (
            <MemberItem key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};

type Member = {
  id: string;
  name: string | null;
  image: string | null;
  activity: "ONLINE" | "IDLE" | "DND" | "OFFLINE" | null;
  discriminator: string | null;
};

const MemberItem = ({ member }: { member: Member }) => {
  const isOffline = member.activity === "OFFLINE";

  return (
    <div
      className={`flex items-center gap-2 rounded px-2 py-1.5 hover:bg-white/5 cursor-pointer ${isOffline ? "opacity-50" : ""}`}
    >
      <div className="relative">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">
            {member.name?.[0] ?? "?"}
          </AvatarFallback>
          <AvatarImage src={member.image ?? undefined} />
        </Avatar>
        <div
          className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-zinc-900 ${activityColors[member.activity ?? "OFFLINE"]}`}
        />
      </div>
      <span className="text-sm text-zinc-300 truncate">{member.name}</span>
    </div>
  );
};
