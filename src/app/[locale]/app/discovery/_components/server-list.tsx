"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerListBusiness } from "./useServerList";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { ServerIcon } from "@/components/pages/global/sidebar/server-icon";
import { TooltipProvider } from "@/components/ui/tooltip";


export function ServerList() {
  const t = useTranslations("discovery");
  const { servers, isLoading, handleJoin, joinServer, router } = useServerListBusiness();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-lg border border-white/5 p-4 space-y-3">
            <Skeleton className="size-12 rounded-full" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!servers?.length) {
    return (
      <p className="text-sm text-zinc-400">{t("no-servers")}</p>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {servers.map((server) => (
        <div
          key={server.id}
          className="rounded-lg border border-white/5 bg-zinc-900/50 p-4 flex flex-col gap-3 hover:border-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ServerIcon id={server.id} icon={server.icon} name={server.name} />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">{server.name}</h3>
              <p className="text-xs text-zinc-400 truncate">
                {t("owner")}: {server.ownerName}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Users size={14} />
              {server.memberCount} {t("members")}
            </span>
            {server.isMember ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => router.push(`/app/servers/${server.id}`)}
              >
                {t("joined")}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => handleJoin(server.id)}
                disabled={joinServer.isPending}
              >
                {t("join")}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
    </TooltipProvider>
  );
}
