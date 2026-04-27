"use client";

import { Button } from "@/components/ui/button";
import { useAddFriendPanel } from "./useAddFriendPanel";

type AddFriendPanelProps = {
  onSuccess: () => void;
};

export const AddFriendPanel = ({ onSuccess }: AddFriendPanelProps) => {
  
  const {
    friendTag,
    onFriendTagChange,
    feedback,
    isSubmitting,
    onSubmitFriendRequest,
  } = useAddFriendPanel({
    onSuccess,
  });

  return (
    <div className="border-b border-white/10 px-4 py-4">
      <p className="text-sm font-semibold text-zinc-100">Add Friend</p>
      <p className="mt-1 text-sm text-zinc-400">
        You can add friends with their Discord username.
      </p>
      <form
        onSubmit={onSubmitFriendRequest}
        className="mt-3 flex flex-wrap items-center gap-3"
      >
        <input
          value={friendTag}
          onChange={(event) => onFriendTagChange(event.target.value)}
          placeholder="giga#7777"
          className="h-9 min-w-[240px] flex-1 rounded-md border border-white/10 bg-[#101218] px-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-500 focus:border-zinc-500"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="h-9 px-4"
        >
          Send Friend Request
        </Button>
      </form>
      {feedback && (
        <p
          className={
            feedback.type === "success"
              ? "mt-2 text-sm text-green-400"
              : "mt-2 text-sm text-red-400"
          }
        >
          {feedback.text}
        </p>
      )}
    </div>
  );
};
