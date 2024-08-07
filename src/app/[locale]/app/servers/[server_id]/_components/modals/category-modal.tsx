"use client";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategoryChannels } from "@/hooks/category-channels";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { createCategory } from "./actions";
import { Loader2 } from "lucide-react";

type CategoryModalProps = {
  serverId: string;
};

export const CategoryModal = ({ serverId }: CategoryModalProps) => {
  const t = useTranslations("modals.category");
  const closeModalRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { addCategory } = useCategoryChannels();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-semibold">{t("title")}</DialogTitle>
      </DialogHeader>
      <form
        action={async (e) => {
          const response = await createCategory(e, serverId);
          setLoading(true);

          if (response.success) {
            setLoading(false);
            addCategory({
              serverId,
              channels: [],
              id: response.categoryInfo?.id as string,
              name: response.categoryInfo?.name as string,
            });
            closeModalRef.current?.click();
          }
        }}
      >
        <Label className="text-xs uppercase">{t("label")}</Label>
        <Input placeholder="New Category" name="name" />
        <Button className="w-full mt-3" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : t("button")}
        </Button>
      </form>
      <DialogClose ref={closeModalRef} className="hidden" />
    </DialogContent>
  );
};
