import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export type SidebarHeaderProps = {
  name: string;
  serverId: string;
  categories: {
    id: string;
    serverId: string | null;
    name: string | null;
  }[];
};

export const SidebarHeader = ({ name }: SidebarHeaderProps) => {
  return (
    <Button
      variant="ghost"
      size="lg"
      className="flex w-full items-center text-start hover:bg-white/15 transition-all rounded-md cursor-pointer px-2 py-3 "
    >
      <div className="w-full text-sm">{name}</div>
      <ChevronDown size={16} />
    </Button>
  );
};
