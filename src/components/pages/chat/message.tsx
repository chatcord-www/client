"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Textarea } from "@/components/ui/textarea";
import { ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { format } from "date-fns";
import {
  Copy,
  MessageSquareDashed,
  Pencil,
  Reply,
  User2,
} from "lucide-react";
import type { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { DeleteMessageButton } from "@/components/pages/chat/actions/delete-message-button";
import { MediaPreviewModal } from "@/components/pages/chat/modals/media-preview-modal";
import { getMediaType } from "@/components/pages/chat/utils/get-media-type";
import Twemoji from "react-twemoji";
import { useReplyStore } from "@/hooks/use-reply-store";

type MessageProps = {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  createdAt: Date;
  session: Session;
  editedAt?: Date;
  replyTo?: {
    id: string;
    content: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  } | null;
  onEditMessage: (params: { messageId: string; newContent: string }) => Promise<any>;
};

export const Message = ({
  username,
  avatar,
  createdAt,
  message,
  id,
  userId,
  session,
  editedAt,
  replyTo,
  onEditMessage,
}: MessageProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const t = useTranslations("channel.message");
  const [editedMessage, setEditedMessage] = useState<string>(message);
  const utils = api.useUtils?.();
  const mediaType = getMediaType(message);
  const { loadSelectedReply } = useReplyStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEditing(false);
      if (isEditing && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isEditing, editedMessage]);

  const handleSave = async () => {
    const trimmed = editedMessage.trim();
    if (trimmed === message) return;
    if (!trimmed) return;
    try {
      await onEditMessage({
        messageId: id,
        newContent: trimmed,
      });
      await utils?.getMessages?.invalidate?.();
      setIsEditing(false);
    } catch (error) {
      console.log("Failed to edit message:", error);
    }
  };

  const handleReply = () => {
    loadSelectedReply({
      id,
      content: message,
      username,
      avatar,
      mediaType,
    });
  };

  const handleJumpToRepliedMessage = () => {
    if (!replyTo?.id) return;

    const target = document.querySelector<HTMLElement>(
      `[data-message-id="${replyTo.id}"]`,
    );

    if (!target) return;

    const highlightedTarget = target as HTMLElement & {
      replyHighlightTimeout?: number;
    };

    if (highlightedTarget.replyHighlightTimeout) {
      window.clearTimeout(highlightedTarget.replyHighlightTimeout);
    }

    target.scrollIntoView({ behavior: "smooth", block: "center" });

    target.style.backgroundColor = "rgba(59, 130, 246, 0.18)";

    highlightedTarget.replyHighlightTimeout = window.setTimeout(() => {
      target.style.backgroundColor = "";
    }, 3000);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="py-3 hover:bg-slate-700/10 px-4 cursor-default" data-message-id={id}>
          <div className="flex items-end">
            <Avatar className="mb-0.5 shrink-0">
              <AvatarFallback>{username[0]}</AvatarFallback>
              <AvatarImage src={avatar} />
            </Avatar>
            <div className="ml-2 w-full">
              {!isEditing && replyTo && (
                <button
                  type="button"
                  className="group -ml-7 mb-1 flex items-center gap-1.5 text-[13px] transition-colors"
                  onClick={handleJumpToRepliedMessage}
                >
                  <span className="h-4 w-8 shrink-0 self-center rounded-tl-md border-l border-t border-zinc-600/70 transition-colors group-hover:border-zinc-400/90" />
                  <Avatar className="size-[18px] shrink-0">
                    <AvatarFallback className="text-[10px]">
                      {replyTo.user.name?.[0] ?? "?"}
                    </AvatarFallback>
                    <AvatarImage src={replyTo.user.avatar} />
                  </Avatar>
                  <span className="shrink-0 truncate font-semibold text-zinc-300 transition-colors group-hover:text-zinc-100">
                    {replyTo.user.name}
                  </span>
                  <p className="min-w-0 truncate text-zinc-400 transition-colors group-hover:text-zinc-300">
                    {replyTo.content}
                  </p>
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="text-sm">{username}</div>
                <time className="text-xs text-zinc-400">
                  {format(createdAt, "PPpp")}
                </time>
              </div>
              {isEditing ? (
                <div>
                  <Textarea
                    value={editedMessage}
                    className="w-full"
                    onChange={(e) => setEditedMessage(e.currentTarget.value)}
                    autoFocus
                  />
                  <div className="text-xs mt-1 flex gap-2 items-center">
                    {t("editing.esc-to")} 
                    <span
                      className="cursor-pointer text-blue-400 hover:underline"
                      onClick={() => setIsEditing(false)}
                    >
                      {t("editing.cancel")}
                    </span>
                    {t("editing.and-enter-to")}
                    <button
                      className="cursor-pointer text-blue-400 hover:underline disabled:opacity-50"
                      onClick={handleSave}
                      disabled={editedMessage.trim() === message}
                    >
                      {t("editing.save")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  {mediaType === "image" && (
                    <button
                      type="button"
                      className="inline-block w-fit rounded-md"
                      onClick={() => setPreviewOpen(true)}
                    >
                      <img
                        src={message}
                        alt="uploaded media"
                        className="max-h-72 max-w-md cursor-pointer rounded-md object-cover"
                      />
                    </button>
                  )}
                  {mediaType === "video" && (
                    <button
                      type="button"
                      className="relative inline-block w-fit overflow-hidden rounded-md"
                      onClick={() => setPreviewOpen(true)}
                    >
                    <video
                      src={message}
                      controls
                      playsInline
                      preload="metadata"
                      className="max-h-72 max-w-md cursor-pointer rounded-md object-cover"
                    />
                    </button>
                  )}
                  {mediaType === "text" && (
                <Twemoji
                  options={{
                    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
                  }}
                >
                  <div className="flex items-center gap-1 [&_p>img]:size-5">
                  <p className="text-sm">
                    {message}
                  </p>
                  {editedAt && (<span className="text-xs text-gray-500">(edited)</span>)}
                  </div>
                </Twemoji>
                  )}
                  {mediaType !== "text" && editedAt && (
                    <p className="mt-1 text-xs text-gray-500">(edited)</p>
                  )}
                </div>
              )}

              {(mediaType === "image" || mediaType === "video") && (
                <MediaPreviewModal
                  open={previewOpen}
                  onOpenChange={setPreviewOpen}
                  mediaType={mediaType}
                  src={message}
                />
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent forceMount>
        <ContextMenuItem onClick={handleReply}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">{t("reply")}</div>
            <Reply size={15} />
          </div>
        </ContextMenuItem>
        {session?.user?.id === userId && (
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            <div className="flex justify-between items-center w-full gap-3">
              <div className="text-xs">{t("edit")}</div>
              <Pencil size={15} />
            </div>
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(message)}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">{t("copy-text")}</div>
            <Copy size={15} />
          </div>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(userId)}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">{t("copy-user-id")}</div>
            <User2 size={15} />
          </div>
        </ContextMenuItem>
        {session?.user?.id === userId && (
          <DeleteMessageButton
            messageId={id}
            username={username}
            avatar={avatar}
            content={message}
            createdAt={createdAt}
          />
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => navigator.clipboard.writeText(id)}>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="text-xs">{t("copy-message-id")}</div>
            <MessageSquareDashed size={15} />
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
