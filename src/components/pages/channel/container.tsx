/* eslint-disable */
"use client";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Message } from "../chat/message";

export const ChannelContainer = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full h-[calc(100vh-230px)] pb-2">
      <Message
        id="hah"
        avatar=""
        createdAt={new Date()}
        message={"zd basota 😜"}
        userId="userna"
        username="niko"
        session={session as Session}
      />
    </div>
  );
};
