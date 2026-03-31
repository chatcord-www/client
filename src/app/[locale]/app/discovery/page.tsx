import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ServerList } from "./_components/server-list";

export const metadata = {
  title: "Chat • Discovery",
};

export default async function DiscoverPage() {
  const t = await getTranslations("discovery");

  return (
    <div className="w-full h-[calc(100vh-20px)] overflow-y-auto">
    <header className="relative">
      <div className="h-40 w-full overflow-hidden">
        <img
          src="/assets/discovery-background.svg"
          alt="banner"
          draggable={false}
        />
      </div>
      <div className="px-6">
        <h1 className="mt-4 text-2xl font-semibold">{t("title")}</h1>
        <div className="flex items-center">
          <Input
            className="mt-2 max-w-96 pr-8"
            placeholder={t("input-placeholer")}
          />
          <Search size={16} className="mt-2 -translate-x-7 text-zinc-400" />
          </div>
        </div>
      </header>
      <div className="px-6 mt-6">
        <ServerList />
      </div>
    </div>
  );
}
