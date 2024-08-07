import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { SessionProvider } from "@/components/providers/session";
import { ThemeProvider } from "@/components/providers/theme";
import { Pogressbar } from "@/components/ui/pogressbar";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata = {
  title: "Chat",
  description: "Chatting application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${GeistSans.variable}`}>
      <body>
        <Pogressbar />
        <SessionProvider>
          <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
