import { Navbar } from "@/components/main/navbar";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => (
  <>
    <div className="fixed -top-96 start-1/2 -z-10 flex -translate-x-1/2 transform">
      <div className="h-[44rem] w-[25rem] -translate-x-[10rem] rotate-[-60deg] transform bg-gradient-to-r from-violet-300/50 to-purple-100 blur-3xl dark:from-green-900/50 dark:to-green-900" />
      <div className="rounded-fulls h-[50rem] w-[90rem] origin-top-left -translate-x-[15rem] -rotate-12 bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-50 blur-3xl dark:from-green-900/70 dark:via-emerald-900/70 dark:to-green-900/70" />
    </div>
    <Navbar />
    {children}
  </>
);

export default Layout;
