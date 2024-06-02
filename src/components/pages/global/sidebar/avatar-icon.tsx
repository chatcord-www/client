import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const AvatarIcon = () => {
  return (
    <Avatar className="cursor-pointer">
      <AvatarImage src="https://cdn.discordapp.com/avatars/1026793851685437491/3f3a7a8ae1c6d03986a03564863e2d9b.png" />
      <AvatarFallback>N</AvatarFallback>
    </Avatar>
  );
};
