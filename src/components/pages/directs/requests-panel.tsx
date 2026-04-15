"use client";

import { Button } from "@/components/ui/button";
import { FriendsTab } from "@/components/pages/directs/friends-tab";
import { IncomingRequestsTab } from "@/components/pages/directs/incoming-requests-tab";
import { OutgoingRequestsTab } from "@/components/pages/directs/outgoing-requests-tab";
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
    query,
    setQuery,
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
          <Button
            type="button"
            size="sm"
            variant={tab === "incoming" ? "default" : "ghost"}
            onClick={() => setTab("incoming")}
            className="h-7 px-3"
          >
            Incoming ({incomingCount})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === "outgoing" ? "default" : "ghost"}
            onClick={() => setTab("outgoing")}
            className="h-7 px-3"
          >
            Outgoing ({outgoingCount})
          </Button>
          <Button
            type="button"
            size="sm"
            className="ml-auto h-7 bg-indigo-500 px-3 text-white hover:bg-indigo-400"
          >
            Add Friend
          </Button>
        </div>

        <div className="px-4 py-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm text-zinc-400">
                Pending requests: <span className="font-semibold text-zinc-200">{pendingCount}</span>
              </div>
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

            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {tab === "incoming"
                ? `Incoming - ${incomingCount}`
                : tab === "outgoing"
                  ? `Outgoing - ${outgoingCount}`
                  : `${friendsLabel} - ${friendsCount}`}
            </div>

            {loading && (
              <div className="rounded-lg border border-white/10 bg-[#11131a] p-4 text-sm text-zinc-400">
                Loading requests...
              </div>
            )}

        
            {!loading && (tab === "all" || tab === "online") && filteredFriends.length === 0 && (
              <div className="rounded-lg border border-white/10 bg-[#11131a] p-8 text-center text-sm text-zinc-500">
                {tab === "online"
                  ? "No friends are online right now."
                  : "No friends found yet."}
              </div>
            )}

            {!loading && tab === "incoming" && filteredIncoming.length > 0 && (
              <IncomingRequestsTab
                items={filteredIncoming as IncomingRequestItem[]}
                isBusy={isBusy}
                onAccept={onAccept}
                onDecline={onDecline}
              />
            )}

            {!loading && tab === "outgoing" && filteredOutgoing.length > 0 && (
              <OutgoingRequestsTab
                items={filteredOutgoing as OutgoingRequestItem[]}
                isBusy={isBusy}
                onCancel={onCancel}
              />
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
