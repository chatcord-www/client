"use client";

import { TRPCClientError } from "@trpc/client";
import { api } from "@/trpc/react";
import { useState, type FormEvent } from "react";

type UseAddFriendPanelParams = {
  onSuccess: () => void;
};

export const useAddFriendPanel = ({
  onSuccess,
}: UseAddFriendPanelParams) => {
  const utils = api.useUtils();
  const [friendTag, setFriendTag] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const sendFriendRequestByTag = api.friend.sendFriendRequestByTag.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.friend.listFriends.invalidate(),
        utils.friend.listIncomingRequests.invalidate(),
        utils.friend.listOutgoingRequests.invalidate(),
      ]);
    },
  });

  const onFriendTagChange = (value: string) => {
    const hashIndex = value.indexOf("#");

    if (hashIndex === -1) {
      setFriendTag(value);
      return;
    }

    const username = value.slice(0, hashIndex);
    const discriminator = value
      .slice(hashIndex + 1)
      .replace(/\D/g, "")
      .slice(0, 4);

    setFriendTag(`${username}#${discriminator}`);
  };

  const onSubmitFriendRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTag = friendTag.trim();
    if (!normalizedTag) {
      setFeedback({
        type: "error",
        text: "Enter a username in the format username#1234",
      });
      return;
    }

    try {
      const result = await sendFriendRequestByTag.mutateAsync({ tag: normalizedTag });
      if (result.status === "OUTGOING_REQUEST") {
        setFeedback({ type: "success", text: `Friend request sent to ${normalizedTag}` });
      } else {
        setFeedback({
          type: "success",
          text: `You are now friends with ${normalizedTag}`,
        });
      }
      setFriendTag("");
      onSuccess();
    } catch (error) {
      if (error instanceof TRPCClientError) {
        setFeedback({
          type: "error",
          text: error.shape?.message ?? error.message,
        });
        return;
      }

      setFeedback({
        type: "error",
        text: "Could not send friend request. Please try again.",
      });
    }
  };

  return {
    friendTag,
    onFriendTagChange,
    feedback,
    isSubmitting: sendFriendRequestByTag.isPending,
    onSubmitFriendRequest,
  };
};
