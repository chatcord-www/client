"use client";
import { useSession } from "next-auth/react";
import { Message } from "../chat/message";
import type { Session } from "next-auth";

export const ChannelContainer = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full h-[calc(100vh-230px)] pb-2">
      {new Array(10).fill(null).map((_, index) => (
        <Message
          id="hah"
          key={index}
          avatar=""
          createdAt={new Date()}
          message="Hello guyss"
          userId="userna"
          username="niko"
          session={session as Session}
        />
      ))}
    </div>
  );
};
