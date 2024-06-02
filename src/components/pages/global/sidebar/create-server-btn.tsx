"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export const CreateServerButton = () => {
  const t = useTranslations("sidebar");

  return (
    <Tooltip>
      <TooltipContent side="right">{t("create-server")}</TooltipContent>
      <TooltipTrigger asChild>
        <Button className="rounded-full p-6" variant="secondary" size="icon">
          <Plus className={cn("flex-none text-zinc-500")} size={22} />
        </Button>
      </TooltipTrigger>
    </Tooltip>
  );
};
