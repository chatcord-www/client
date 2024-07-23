import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Hash, Volume2 } from "lucide-react";

export const ChannelModal = () => {
  return (
    <DialogContent>
      <DialogHeader className="mb-3">
        <DialogTitle>Create Channel</DialogTitle>
      </DialogHeader>
      <div>
        <Label className="text-xs uppercase">Channel Type</Label>
        <RadioGroup defaultValue="text" className="">
          <div>
            <RadioGroupItem
              value="text"
              id="text"
              className="peer sr-only w-full"
            />
            <Label
              htmlFor="text"
              className="flex flex-col w-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex items-center gap-2 text-white">
                <Hash size={20} />
                <span>Text</span>
              </div>
              <p className="font-normal text-xs text-zinc-300">
                Send messages, GIFs, emojis
              </p>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="voice"
              id="voice"
              className="peer sr-only w-full"
            />
            <Label
              htmlFor="voice"
              className="flex flex-col w-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex items-center gap-2 text-white">
                <Volume2 size={20} />
                <span>Voice</span>
              </div>
              <p className="text-xs font-normal text-zinc-300">
                Hang out together with voice, video and screen share
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label className="text-xs uppercase">Channel Name</Label>
        <Input placeholder="new-channel" />
      </div>

      <Button>Create</Button>
    </DialogContent>
  );
};
