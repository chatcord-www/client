/* eslint-disable */
"use client";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Message } from "../chat/message";

export const ChannelContainer = () => {
  const { data: session } = useSession();
  const [mockMessages, setMockMessages] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://type.fit/api/quotes")
      .then((response) => response.json())
      .then((data) =>
        data.map((quote: any) =>
          setMockMessages((prev) => [...prev, quote.text]),
        ),
      );
  }, []);

  return (
    <div className="w-full h-[calc(100vh-230px)] pb-2">
      {mockMessages.map((message, index) => (
        <Message
          id="hah"
          key={index}
          avatar=""
          createdAt={new Date()}
          message={message}
          userId="userna"
          username="niko"
          session={session as Session}
        />
      ))}
    </div>
  );
};
