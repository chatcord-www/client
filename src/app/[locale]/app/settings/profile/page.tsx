import { Label } from "@/components/ui/label";
import { ProfileForm } from "./profile-form";

export default async function SettingsDescription() {
  return (
    <div className="p-4">
      <Label className="mb-5 text-sm uppercase text-slate-300">Profile</Label>
      <ProfileForm />
    </div>
  );
}
