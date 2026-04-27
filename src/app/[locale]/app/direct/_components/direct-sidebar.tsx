"use client";

import { FriendsTab } from "@/components/pages/direct/friends-tab";
import { useRequestPanel } from "@/components/pages/direct/UseRequestPanel";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { Users } from "lucide-react";

export function DirectSidebar() {

  const {
    friends,
    loading,
    isBusy,
    onRemoveFriend,
  } = useRequestPanel();

  return (
    <aside className="flex w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#15171d] text-zinc-100">
      <div className="border-b border-white/10 px-4 py-3">
        <Button
          asChild
          type="button"
          variant="ghost"
          className="mb-2 h-10 w-full justify-start gap-2 rounded-md px-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          <Link
            href="/app/direct"
            className={"bg-white/10 text-white"}
          >
            <Users className="size-4" />
            Friends
          </Link>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {loading ? (
          <div className="rounded-lg border border-white/10 bg-[#11131a] p-4 text-sm text-zinc-400">
            Loading conversations...
          </div>
        ) : friends.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-[#11131a] p-4 text-center text-sm text-zinc-500">
            No conversations yet.
          </div>
        ) : (
          <FriendsTab
            items={friends}
            isBusy={isBusy}
            onRemoveFriend={onRemoveFriend}
          />
        )}
      </div>


    </aside>
  );
}
