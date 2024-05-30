"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";

export const LangChanger = () => {
  const { push } = useRouter();

  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => push("/", { locale: "en" })}>English</Button>
      <Button onClick={() => push("/", { locale: "ka" })}>ქართული</Button>
    </div>
  );
};
