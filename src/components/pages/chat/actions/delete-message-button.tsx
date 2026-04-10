"use client";

import { ContextMenuItem } from "@/components/ui/context-menu";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Trash } from "lucide-react";
import { DeleteMessageModal } from "@/components/pages/chat/modals/delete-message-modal";

type DeleteMessageButtonProps = {
  messageId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: Date;
};

export function DeleteMessageButton({
  messageId,
  username,
  avatar,
  content,
  createdAt,
}: DeleteMessageButtonProps) {
  const t = useTranslations("channel.message");
  const [open, setOpen] = useState(false);

  return (
    <>
      <ContextMenuItem
        danger
        onSelect={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        <div className="flex justify-between items-center w-full gap-3">
          <div className="text-xs">{t("delete-message")}</div>
          <Trash size={15} />
        </div>
      </ContextMenuItem>
      <DeleteMessageModal
        open={open}
        onOpenChange={setOpen}
        messageId={messageId}
        username={username}
        avatar={avatar}
        content={content}
        createdAt={createdAt}
      />
    </>
  );
}