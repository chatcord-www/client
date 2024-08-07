"use client";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCategoryChannels } from "@/hooks/category-channels";
import { Hash, Loader2, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { ChannelType } from "../sidebar-header";
import { createChannel } from "./actions";

type ChannelModalProps = {
  serverId: string;
  categoryId: string;
  onCategorySelect?: (id: string) => void;
};

export const ChannelModal = ({ serverId, categoryId }: ChannelModalProps) => {
  const [loading, setLoading] = useState(false);
  const { addChannelInCategory, addChannelWithoutCategory } =
    useCategoryChannels();
  const t = useTranslations("modals.channel");
  const closeModalRef = useRef<HTMLButtonElement>(null);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("title")}</DialogTitle>
      </DialogHeader>
      <form
        action={async (e) => {
          setLoading(true);
          const response = await createChannel(e, serverId, categoryId);

          if (response.success) {
            setLoading(false);
            if (response.categoryId) {
              addChannelInCategory(
                response.channelInfo as ChannelType,
                categoryId,
              );
            } else {
              addChannelWithoutCategory(response.channelInfo as ChannelType);
            }
            closeModalRef.current?.click();
          }
        }}
      >
        <div>
          <Label className="text-xs uppercase">{t("type")}</Label>
          <RadioGroup defaultValue="TEXT" name="type" required>
            <div>
              <RadioGroupItem
                defaultChecked
                value="TEXT"
                id="text"
                className="peer sr-only w-full"
              />
              <Label
                htmlFor="text"
                className="flex flex-col w-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex items-center gap-2 text-white">
                  <Hash size={20} />
                  <span>{t("text")}</span>
                </div>
                <p className="font-normal text-xs text-zinc-300">
                  {t("text-description")}
                </p>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="VOICE"
                id="voice"
                className="peer sr-only w-full"
              />
              <Label
                htmlFor="voice"
                className="flex flex-col w-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex items-center gap-2 text-white">
                  <Volume2 size={20} />
                  <span>{t("voice")}</span>
                </div>
                <p className="text-xs font-normal text-zinc-300">
                  {t("voice-description")}
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="text-xs uppercase">{t("label")}</Label>
          <Input placeholder="new-channel" name="name" required />
        </div>
        <Button className="w-full mt-3" type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin size-5" /> : t("button")}
        </Button>
      </form>
      <DialogClose ref={closeModalRef} className="hidden" />
    </DialogContent>
  );
};
