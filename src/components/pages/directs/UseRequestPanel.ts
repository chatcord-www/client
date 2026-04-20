"use client";

import { api } from "@/trpc/react";
import { useEffect, useMemo, useState } from "react";

export type DirectsTab = "online" | "all" | "pending";

export const useRequestPanel = () => {
  const [tab, setTab] = useState<DirectsTab>("all");
  const [query, setQuery] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const utils = api.useUtils();

  const { data: friends = [], isLoading: friendsLoading } =
    api.friend.listFriends.useQuery();

  const { data: incoming = [], isLoading: incomingLoading } =
    api.friend.listIncomingRequests.useQuery();

  const { data: outgoing = [], isLoading: outgoingLoading } =
    api.friend.listOutgoingRequests.useQuery();

  const refreshAll = async () => {
    await Promise.all([
      utils.friend.listFriends.invalidate(),
      utils.friend.listIncomingRequests.invalidate(),
      utils.friend.listOutgoingRequests.invalidate(),
    ]);
  };

  const accept = api.friend.acceptFriendRequest.useMutation({
    onSuccess: refreshAll,
  });

  const decline = api.friend.declineFriendRequest.useMutation({
    onSuccess: refreshAll,
  });

  const cancel = api.friend.cancelFriendRequest.useMutation({
    onSuccess: refreshAll,
  });

  const removeFriend = api.friend.removeFriend.useMutation({
    onSuccess: refreshAll,
  });

  const incomingCount = incoming.length;
  const outgoingCount = outgoing.length;
  const pendingCount = incomingCount + outgoingCount;

  useEffect(() => {
    if (tab === "pending" && pendingCount === 0) {
      setTab("all");
    }
  }, [pendingCount, tab]);

  const onlineFriends = friends.filter((friend) => friend.activity !== "OFFLINE");
  const friendSource = tab === "online" ? onlineFriends : friends;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredFriends = useMemo(() => {
    if (!normalizedQuery) {
      return friendSource;
    }

    return friendSource.filter((friend) => {
      const tag = friend.discriminator ? `#${friend.discriminator}` : "";
      const name = friend.name ?? "";
      return `${name}${tag}`.toLowerCase().includes(normalizedQuery);
    });
  }, [friendSource, normalizedQuery]);

  const filteredIncoming = useMemo(() => {
    if (!normalizedQuery) {
      return incoming;
    }

    return incoming.filter((request) => {
      const tag = request.sender.discriminator
        ? `#${request.sender.discriminator}`
        : "";
      const name = request.sender.name ?? "";
      return `${name}${tag}`.toLowerCase().includes(normalizedQuery);
    });
  }, [incoming, normalizedQuery]);

  const filteredOutgoing = useMemo(() => {
    if (!normalizedQuery) {
      return outgoing;
    }

    return outgoing.filter((request) => {
      const tag = request.receiver.discriminator
        ? `#${request.receiver.discriminator}`
        : "";
      const name = request.receiver.name ?? "";
      return `${name}${tag}`.toLowerCase().includes(normalizedQuery);
    });
  }, [outgoing, normalizedQuery]);

  const loading =
    tab === "pending"
      ? incomingLoading || outgoingLoading
        : friendsLoading;

  const isBusy =
    accept.isPending ||
    decline.isPending ||
    cancel.isPending ||
    removeFriend.isPending;

  const friendsLabel = tab === "online" ? "Online" : "All friends";
  const friendsCount = filteredFriends.length;

  return {
    tab,
    setTab,
    showAddFriend,
    setShowAddFriend,
    query,
    setQuery,
    friends,
    incomingCount,
    outgoingCount,
    pendingCount,
    filteredFriends,
    filteredIncoming,
    filteredOutgoing,
    loading,
    isBusy,
    friendsLabel,
    friendsCount,
    onAccept: (requesterId: string) => accept.mutate({ requesterId }),
    onDecline: (requesterId: string) => decline.mutate({ requesterId }),
    onCancel: (targetUserId: string) => cancel.mutate({ targetUserId }),
    onRemoveFriend: (targetUserId: string) => removeFriend.mutate({ targetUserId }),
  };
};