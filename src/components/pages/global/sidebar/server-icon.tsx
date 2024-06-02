"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/navigation";
import Image from "next/image";
import { useMemo } from "react";

export type ServerIconProps = {
  id: string;
  name: string;
  image: string;
};

export const ServerIcon = ({ id, image, name }: ServerIconProps) => {
  const pathname = usePathname();

  const isSelected = useMemo(() => {
    return pathname.includes(`/app/${id}`);
  }, [pathname]);

  return (
    <Link href={`/app/${id}`}>
      <Tooltip>
        <TooltipContent side="right">{name}</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            className={cn("relative flex items-center justify-center border overflow-hidden rounded-full p-6", isSelected && "border-primary border")}
            variant="secondary"
            size="icon"
          >
            {image ? (
              <Image
                src={image}
                width={100}
                height={100}
                alt={name}
                className="absolute h-full w-full flex-none object-cover"
                draggable={false}
              />
            ) : (
              <span className="select-none uppercase text-xl">{name[0]}</span>
            )}
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </Link>
  );
};
