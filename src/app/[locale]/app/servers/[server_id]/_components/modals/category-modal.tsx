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
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { createCategory } from "./actions";
import { useTranslations } from "next-intl";

type CategoryModalProps = {
  serverId: string;
};

const Submit = () => {
  const { pending } = useFormStatus();
  const t = useTranslations("modals.category");

  return (
    <Button className="w-full mt-3" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : t("button")}
    </Button>
  );
};

export const CategoryModal = ({ serverId }: CategoryModalProps) => {
  const closeModalRef = useRef<HTMLButtonElement>(null);
  const { addCategory } = useCategoryChannels();
  const t = useTranslations("modals.category");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-semibold">{t("title")}</DialogTitle>
      </DialogHeader>
      <form
        action={async (e) => {
          const response = await createCategory(e, serverId);

          if (response.success) {
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
        <Submit />
      </form>
      <DialogClose ref={closeModalRef} className="hidden" />
    </DialogContent>
  );
};
