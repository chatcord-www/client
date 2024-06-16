import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getServerAuthSession } from "@/server/auth";

export default async function SettingsDescription() {
  const session = await getServerAuthSession();

  return (
    <div className="p-4">
      <Label className="mb-5 text-sm uppercase text-slate-300">Profile</Label>
      <div className="mt-3 flex gap-3">
        <div className="w-1/2 space-y-3">
          <div>
            <Label className="text-xs uppercase">Name</Label>
            <Input defaultValue={session?.user.name ?? ""} />
          </div>
          <div>
            <Label className="text-xs uppercase">Email</Label>
            <Input value={session?.user.email ?? ""} readOnly disabled />
          </div>
          <div>
            <Label className="text-xs uppercase">About me</Label>
            <Textarea defaultValue={session?.user.aboutMe ?? ""} />
          </div>
          <div>
            <Label className="text-xs uppercase">Avatar</Label>
            <div className="mt-3 flex items-center space-x-4">
              <img
                src={session?.user.image ?? ""}
                className="size-[90px] rounded-full"
              />
              <Button variant={"secondary"}>Change avatar</Button>
              <Button variant={"ghost"}>Remove avatar</Button>
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase">Banner color</Label>
            <div>
              <div className="h-10 w-16 rounded-sm bg-pink-400" />
            </div>
          </div>
          <Button size="lg">Save</Button>
        </div>
      </div>
    </div>
  );
}
