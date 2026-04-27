"use client";

import { useChatTyping } from "@/hooks/chat-typing";
import { TypingIndicator } from "./typing-indicator";

export const TypingIndicatorBar = () => {
  const typingUsers = useChatTyping((state) => state.typingUsers);
  const typingNames = typingUsers.map((typingUser) => typingUser.name);

  return <TypingIndicator typingNames={typingNames} />;
};