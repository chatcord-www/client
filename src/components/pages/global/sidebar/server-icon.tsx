"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/navigation";
import { useMemo } from "react";

export type ServerIconProps = {
  id: string | null;
  name: string | null;
  icon: string | null;
};

export const ServerIcon = ({ id, icon, name }: ServerIconProps) => {
  const pathname = usePathname();

  const isSelected = useMemo(() => {
    return pathname.includes(`/app/channels/${id}`);
  }, [pathname]);

  return (
    <Link href={`/app/channels/${id}`}>
      <Tooltip>
        <TooltipContent side="right">{name}</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-full border p-6",
              isSelected && "rounded-lg bg-primary/40 hover:bg-primary/40",
            )}
            variant="secondary"
            size="icon"
          >
            {icon ? (
              <img
                src={icon}
                alt={name as string}
                className="absolute h-full w-full flex-none object-cover"
                draggable={false}
              />
            ) : (
              <span className="select-none text-xl uppercase">{name?.[0]}</span>
            )}
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </Link>
  );
};
