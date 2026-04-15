"use client";

import { Button } from "@/components/ui/button";
import { AddFriendPanel } from "@/components/pages/directs/add-friend-panel";
import { FriendsTab } from "@/components/pages/directs/friends-tab";
import { PendingTab } from "./pending-tab";
import { useRequestPanel } from "@/components/pages/directs/UseRequestPanel";
import { Search } from "lucide-react";
import type {
  FriendItem,
  IncomingRequestItem,
  OutgoingRequestItem,
} from "./types";

export const RequestsPanel = () => {
  const {
    tab,
    setTab,
    showAddFriend,
    setShowAddFriend,
    query,
    setQuery,
    pendingCount,
    filteredFriends,
    filteredIncoming,
    filteredOutgoing,
    loading,
    isBusy,
    friendsLabel,
    friendsCount,
    onAccept,
    onDecline,
    onCancel,
    onRemoveFriend,
  } = useRequestPanel();

  return (
    <section className="w-full py-2 text-zinc-100">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15171d]">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="mr-2 text-sm font-semibold text-zinc-200">Friends</span>
          <Button
            type="button"
            size="sm"
            variant={tab === "online" ? "secondary" : "ghost"}
            className="h-7 px-3"
            onClick={() => setTab("online")}
          >
            Online
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === "all" ? "secondary" : "ghost"}
            className="h-7 px-3 text-zinc-300 hover:text-white"
            onClick={() => setTab("all")}
          >
            All
          </Button>
          {pendingCount > 0 && (
          <Button
            type="button"
            size="sm"
            variant={tab === "pending" ? "default" : "ghost"}
            onClick={() => setTab("pending")}
            className="h-7 px-3"
          >
              Pending ({pendingCount})
          </Button>
          )}
          <Button
            type="button"
            size="sm"
            className="ml-auto h-7 px-3"
            variant={showAddFriend ? "default" : "ghost"}
            onClick={() => setShowAddFriend((current) => !current)}
          >
            Add Friend
          </Button>
        </div>

        {showAddFriend && (
          <AddFriendPanel
            onSuccess={() => setTab("pending")}
          />
        )}

        <div className="px-4 py-3">
            <div className="mb-3 flex items-center justify-end gap-3">
              <div className="relative w-full max-w-[420px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  placeholder="Search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-9 w-full rounded-md border border-white/10 bg-[#101218] pl-9 pr-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-500 focus:border-zinc-500"
                />
              </div>
            </div>

            {(tab === "online" || tab === "all") && (
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {friendsLabel} — {friendsCount}
            </div>
            )}

            {loading && (
              <div className="rounded-lg border border-white/10 bg-[#11131a] p-4 text-sm text-zinc-400">
                Loading requests...
              </div>
            )}

        
            {!loading && tab === "pending" && (
              <PendingTab
                incoming={filteredIncoming as IncomingRequestItem[]}
                outgoing={filteredOutgoing as OutgoingRequestItem[]}
                isBusy={isBusy}
                onAccept={onAccept}
                onDecline={onDecline}
                onCancel={onCancel}
              />
            )}

            {!loading && (tab === "online" || tab === "all") && filteredFriends.length === 0 && (
              <div className="rounded-lg border border-white/10 bg-[#11131a] p-8 text-center text-sm text-zinc-500">
                {tab === "online" ? "No friends are online right now." : "No friends found yet."}
              </div>
            )}

            {!loading && (tab === "online" || tab === "all") && filteredFriends.length > 0 && (
              <FriendsTab
                items={filteredFriends as FriendItem[]}
                isBusy={isBusy}
                onRemoveFriend={onRemoveFriend}
              />
            )}
        </div>
      </div>
    </section>
  );
};
