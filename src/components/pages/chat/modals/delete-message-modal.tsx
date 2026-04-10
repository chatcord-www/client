"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/trpc/react";

interface DeleteMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: Date;
}

export function DeleteMessageModal({
  open,
  onOpenChange,
  messageId,
  username,
  avatar,
  content,
  createdAt,
}: DeleteMessageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("channel.message.delete-modal");
  const deleteMessageMutation = api.deleteMessage.useMutation();
  const utils = api.useUtils?.();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteMessageMutation.mutateAsync({ messageId });
      await utils?.getMessages?.invalidate?.();
      onOpenChange(false);
    } catch (error) {
      console.log("Failed to delete message:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="my-2 text-zinc-300">{t("description")}</div>
        <div className="flex items-center gap-2 bg-zinc-800 rounded p-3 my-2">
          <Avatar>
            <AvatarFallback>{username[0]}</AvatarFallback>
            <AvatarImage src={avatar} />
          </Avatar>
          <div>
            <div className="font-semibold text-sm">{username} <span className="text-xs font-normal text-zinc-400">{new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
            <div className="text-sm text-zinc-300">{content}</div>
          </div>
        </div>
        <DialogFooter className="flex gap-2 mt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>{t("cancel")}</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>{t("confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}