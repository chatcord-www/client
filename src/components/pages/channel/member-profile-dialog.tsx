"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMemberList } from "@/hooks/UseMemberList";
import { cn } from "@/lib/utils";
import {
  Copy,
  Gift,
  ImagePlus,
  MoreHorizontal,
  Moon,
  UserMinus,
  UserPlus,
} from "lucide-react";

export type Member = {
  id: string;
  name: string | null;
  image: string | null;
  activity: "ONLINE" | "IDLE" | "DND" | "OFFLINE" | null;
  discriminator: string | null;
  bannerColor: string | null;
};

const activityColors: Record<string, string> = {
  ONLINE: "bg-green-500",
  IDLE: "bg-yellow-500",
  DND: "bg-red-500",
  OFFLINE: "bg-zinc-500",
};

type MemberProfileDialogProps = {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const MemberProfileDialog = ({
  member,
  open,
  onOpenChange,
}: MemberProfileDialogProps) => {

  const {
    isSelf,
    isMutating,
    relationshipLoading,
    relationshipStatus,
    onRelationshipAction,
  } = useMemberList({ memberId: member.id, open });

  const actionConfig = {
    SELF: {
      text: "you",
      disabled: true,
      icon: null,
      tone: "default" as const,
    },
    NONE: {
      text: "Add Friend",
      disabled: false,
      icon: <UserPlus className="size-5" />,
      tone: "default" as const,
    },
    OUTGOING_REQUEST: {
      text: "Request Sent",
      disabled: true,
      icon: <UserPlus className="size-5" />,
      tone: "default" as const,
    },
    INCOMING_REQUEST: {
      text: "Accept Request",
      disabled: false,
      icon: <UserPlus className="size-5" />,
      tone: "default" as const,
    },
    FRIEND: {
      text: "Remove Friend",
      disabled: false,
      icon: <UserMinus className="size-5" />,
      tone: "danger" as const,
    },
  };

  const activeAction = actionConfig[relationshipStatus];
  const activity = member.activity ?? "OFFLINE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-zinc-800 bg-zinc-900 p-0 text-zinc-100 shadow-2xl [&>button]:hidden sm:max-w-[38rem]">
        <div className="relative h-48 overflow-hidden bg-purple-400"
          style={{ backgroundColor: member.bannerColor ?? "#a855f7" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0))]" />

          <TooltipProvider delayDuration={120}>
            <div className="absolute right-5 top-5 flex items-center gap-3">
              {!isSelf && (
                <ActionIconButton
                  label={activeAction.text}
                  disabled={activeAction.disabled || relationshipLoading || isMutating}
                  onClick={onRelationshipAction}
                  tone={activeAction.tone}
                >
                  {activeAction.icon}
                </ActionIconButton>
              )}

              <ActionIconButton
                label="Copy ID"
                onClick={() => navigator.clipboard.writeText(member.id)}
              >
                <Copy className="size-5" />
              </ActionIconButton>

              <ActionIconButton label="More actions" disabled>
                <MoreHorizontal className="size-5" />
              </ActionIconButton>
            </div>
          </TooltipProvider>
        </div>

        <div className="bg-zinc-900 px-6 pb-6">
          <div className="-mt-16 mb-4 flex items-end gap-4">
            <div className="relative shrink-0 rounded-full border-[7px] border-zinc-900 bg-zinc-900 shadow-xl">
              <Avatar className="size-28">
                <AvatarFallback className="text-4xl font-semibold">
                  {member.name?.[0] ?? "?"}
                </AvatarFallback>
                <AvatarImage src={member.image ?? undefined} />
              </Avatar>
              <div
                className={cn(
                  "absolute bottom-2 right-2 size-7 rounded-full border-[5px] border-zinc-900",
                  activityColors[activity],
                )}
              />
            </div>

            <div className="pb-3">
              <div className="flex items-center gap-2">
                <p className="text-[2rem] font-extrabold leading-none tracking-tight text-white">
                  {member.name}
                </p>
                {activity === "IDLE" && (
                  <span className="rounded-full bg-yellow-500/15 p-1 text-yellow-400">
                    <Moon className="size-3.5" />
                  </span>
                )}
              </div>

              <p className="mt-2 text-base text-zinc-300">
                {member.name}#{member.discriminator}
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-[22px] bg-zinc-800/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-4 text-zinc-400">
              <div className="flex items-center justify-between gap-4">
                <span className="truncate text-[1.05rem] text-zinc-500">
                  Message @{member.name}
                </span>
                <div className="flex items-center gap-3 text-zinc-500">
                  <Gift className="size-5" />
                  <ImagePlus className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type ActionIconButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  tone?: "default" | "danger";
};

const ActionIconButton = ({
  children,
  disabled,
  label,
  onClick,
  tone = "default",
}: ActionIconButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "size-14 rounded-full border border-white/10 bg-black/45 text-white shadow-lg backdrop-blur-md hover:bg-black/65",
          tone === "danger" && "text-red-300 hover:bg-red-500/15 hover:text-red-200",
        )}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">{label}</TooltipContent>
  </Tooltip>
);
