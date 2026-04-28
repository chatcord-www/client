import { type SocketMessage } from "@/components/pages/chat/types/socket-message";
import { useReplyStore } from "@/hooks/use-reply-store";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export type UploadMediaButtonProps = {
  channelId?: string;
  serverId?: string;
  currentUserId?: string;
  friendId?: string;
  onUploaded: (message: SocketMessage) => void;
  onUploadingChange: (isUploading: boolean) => void;
};

export const useUploadMediaButton = ({
  channelId,
  serverId,
  friendId,
  onUploaded,
  onUploadingChange,
}: UploadMediaButtonProps) => {
  const t = useTranslations("channel");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: sendMessage } = api.sendMessage.useMutation();
  const { mutateAsync: createUploadUrl } = api.generateSignedUrl.useMutation();
  const { selectedReply, clearSelectedReply } = useReplyStore();

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onPickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isMedia =
      file.type.startsWith("image/") || file.type.startsWith("video/");
    if (!isMedia) {
      console.log(t("upload.invalid-type"));
      event.target.value = "";
      return;
    }

    try {
      onUploadingChange(true);

      if (!friendId && !(serverId && channelId)) {
        throw new Error("Missing upload target");
      }

      const { uploadUrl, fileUrl } = await createUploadUrl({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        channelId,
        serverId,
        friendId,
      });

      const uploadResult = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error("Upload to S3 failed");
      }

      const message = await sendMessage({
        channelId,
        serverId,
        text: fileUrl,
        friendId,
        replyToId: selectedReply?.id,
      });

      onUploaded(message);
      clearSelectedReply();
      event.target.value = "";
    } catch (error) {
      console.log(t("upload.failed"), error);
    } finally {
      onUploadingChange(false);
    }
  };

  return {
    t,
    fileInputRef,
    openFilePicker,
    onPickFile,
  };
};