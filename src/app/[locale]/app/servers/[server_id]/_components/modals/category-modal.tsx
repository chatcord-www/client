import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "@radix-ui/react-dialog";

export const CategoryModal = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-semibold">Create Category</DialogTitle>
      </DialogHeader>
      <div>
        <Label className="text-xs uppercase">Category name</Label>
        <Input placeholder="New Category" />
      </div>
      <Button>Create</Button>
    </DialogContent>
  );
};
