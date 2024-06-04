"use client";

import { SessionProvider as Provider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export const SessionProvider = ({ children }: PropsWithChildren) => (
  <Provider>{children}</Provider>
);
