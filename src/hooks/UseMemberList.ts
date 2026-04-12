"use client";

import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

type UseMemberListParams = {
  memberId: string;
  open: boolean;
};

type RelationshipStatus =
  | "SELF"
  | "NONE"
  | "OUTGOING_REQUEST"
  | "INCOMING_REQUEST"
  | "FRIEND";

export const useMemberList = ({
  memberId,
  open,
}: UseMemberListParams) => {
  const { data: session } = useSession();
  const utils = api.useUtils();

  const isSelf = session?.user?.id === memberId;

  const { data: relationship, isLoading: relationshipLoading } =
    api.friend.getRelationship.useQuery(
      { targetUserId: memberId },
      {
        enabled: open && !isSelf,
      },
    );

  const sendFriendRequest = api.friend.sendFriendRequest.useMutation({
    onSuccess: async () => {
      await utils.friend.getRelationship.invalidate({ targetUserId: memberId });
    },
  });

  const acceptFriendRequest = api.friend.acceptFriendRequest.useMutation({
    onSuccess: async () => {
      await utils.friend.getRelationship.invalidate({ targetUserId: memberId });
    },
  });

  const removeFriend = api.friend.removeFriend.useMutation({
    onSuccess: async () => {
      await utils.friend.getRelationship.invalidate({ targetUserId: memberId });
    },
  });

  const relationshipStatus = useMemo<RelationshipStatus>(() => {
    if (isSelf) {
      return "SELF";
    }

    return (relationship?.status ?? "NONE") as RelationshipStatus;
  }, [isSelf, relationship?.status]);

  const isMutating =
    sendFriendRequest.isPending ||
    acceptFriendRequest.isPending ||
    removeFriend.isPending;

  const onRelationshipAction = () => {
    if (relationshipStatus === "NONE") {
      sendFriendRequest.mutate({ targetUserId: memberId });
      return;
    }

    if (relationshipStatus === "INCOMING_REQUEST") {
      acceptFriendRequest.mutate({ requesterId: memberId });
      return;
    }

    if (relationshipStatus === "FRIEND") {
      removeFriend.mutate({ targetUserId: memberId });
    }
  };

  return {
    isSelf,
    isMutating,
    relationshipLoading,
    relationshipStatus,
    onRelationshipAction,
  };
};