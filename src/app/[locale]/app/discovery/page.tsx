import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Chat • Discovery",
};

export default async function DiscoverPage() {
  const t = await getTranslations("discovery");

  return (
    <header className="absolute top-0">
      <div className="h-40 w-full overflow-hidden relative">
        <img
          src="/assets/discovery-background.svg"
          alt="banner"
          draggable={false}
          className=""
        />
      </div>
      <div className="px-3">
        <h1 className="mt-2 text-2xl font-semibold">{t("title")}</h1>
        <div className="flex items-center">
          <Input
            className="mt-1 max-w-96 pr-8"
            placeholder={t("input-placeholer")}
          />
          <Search size={16} className="mt-1 -translate-x-7 text-zinc-400" />
        </div>
      </div>
    </header>
  );
}
