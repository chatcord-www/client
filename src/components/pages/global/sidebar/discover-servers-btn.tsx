'use client'
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/navigation";
import { Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export const DiscoverServersBtn = () => {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  const isInDiscover = useMemo(() => {
    return pathname.includes("/app/discover");
  }, [pathname]);
  
  return (
    <Link href="/app/discover" className="mt-2">
      <Tooltip>
        <TooltipContent side="right">{t("discover")}</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "rounded-full p-6 hover:rounded-lg",
              isInDiscover && "rounded-lg bg-primary/40 hover:bg-primary/40",
            )}
            variant="secondary"
            size="icon"
          >
            <Compass
              className={cn(
                "flex-none text-zinc-500",
                isInDiscover && "text-primary",
              )}
              size={22}
            />
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </Link>
  );
};
