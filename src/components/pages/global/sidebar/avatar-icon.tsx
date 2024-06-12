import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Smile,  Circle } from 'lucide-react';
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const AvatarIcon = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center space-x-4">
          <Avatar className="curso">
            <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/6/67/Doja_Cat_2020_Vogue_Taiwan_01.png" alt="niko" />
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
          <div className="grid gap-2">
            <p>Turbo</p>
            <p>turbovv</p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-3 pb-5">
          <div className="space-y-2 gap-1 grid ml-4">
            <p>niko</p>
            <hr className="w-64" />
            <Label className="w-80 grid">ABOUT ME</Label>
            <p className="text-sm">
              dojacat
            </p>
            <Label className="w-80">MEMBER SINCE</Label>
            <p className="text-sm">
              Oct 4, 2022
            </p>
          </div>
          <div className="grid gap-3 ml-4">
          <div className="grid grid-cols-3 items-center gap-4">
              <Label className="w-80">PLAYING A GAME</Label>
            </div>
            <hr className="w-64" />
          <div className="flex items-center gap-2">
              <Circle />
              <Label>Online</Label>
            </div>
          <div className="flex items-center gap-2">
              <Smile className="text-gray-100" />
              <Label className="">
              Set Costume Status</Label>
            </div>
            <hr className="w-64" />
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="w-80">Copy User ID</Label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
};
