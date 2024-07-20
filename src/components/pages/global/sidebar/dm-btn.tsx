"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const DmButton = () => {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

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
              "rounded-full p-6 hover:rounded-lg",
              isInDirects && "rounded-lg bg-primary/40 hover:bg-primary/40",
            )}
            variant="secondary"
            size="icon"
          >
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
