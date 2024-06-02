import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function DiscoverPage() {
  const t = await getTranslations("discover");

  return (
    <header className="absolute top-0">
      <div className="h-40 w-full overflow-hidden">
        <img src="/assets/discovery-background.svg" alt="banner" draggable={false} />
      </div>
      <div className="px-3">
        <h1 className="mt-2 text-2xl">{t("title")}</h1>
        <div className="flex items-center">
          <Input
            className="mt-1 max-w-96 pr-8"
            placeholder={t("input-placeholer")}
          />
          <Search size={16} className="text-zinc-400 -translate-x-7 mt-1"/>
        </div>
      </div>
    </header>
  );
}
