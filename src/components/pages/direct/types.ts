import { type RouterOutputs } from "@/trpc/react";

export type FriendListItem = RouterOutputs["friend"]["listFriends"][number];
export type IncomingRequestItem =
  RouterOutputs["friend"]["listIncomingRequests"][number];
export type OutgoingRequestItem =
  RouterOutputs["friend"]["listOutgoingRequests"][number];
export type FriendItem = FriendListItem;

type ActivityValue =
  | FriendListItem["activity"]
  | IncomingRequestItem["sender"]["activity"]
  | OutgoingRequestItem["receiver"]["activity"];

export const getActivityColor = (
  activity: ActivityValue,
) => {
  if (activity === "ONLINE") return "bg-green-500";
  if (activity === "IDLE") return "bg-yellow-500";
  if (activity === "DND") return "bg-red-500";
  return "bg-zinc-500";
};

export const getActivityLabel = (activity: ActivityValue) => {
  if (activity === "ONLINE") return "Online";
  if (activity === "IDLE") return "Idle";
  if (activity === "DND") return "Do Not Disturb";
  return "Offline";
};
