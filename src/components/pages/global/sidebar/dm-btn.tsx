"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { api } from "@/trpc/react";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const DmButton = () => {
  const t = useTranslations("sidebar");
  const pathname = usePathname();
  const { data: incoming = [] } = api.friend.listIncomingRequests.useQuery();
  const pendingCount = incoming.length;

  const isInDirects = useMemo(() => {
    return pathname.includes("/app/directs");
  }, [pathname]);

  return (
    <Link href="/app/directs">
      <Tooltip>
        <TooltipContent side="right">{t("dm")}</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "relative rounded-full p-6 hover:rounded-lg",
              isInDirects && "rounded-lg bg-primary/40 hover:bg-primary/40",
            )}
            variant="secondary"
            size="icon"
          >
            {pendingCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
            <MessageCircle
              className={cn(
                "flex-none text-zinc-500",
                isInDirects && "text-primary",
              )}
              size={22}
            />
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </Link>
  );
};
