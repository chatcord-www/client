'use client'
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export const ThemeChanger = () => {
  const { setTheme } = useTheme()

  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => setTheme('light')}>light</Button>
      <Button onClick={() => setTheme('dark')}>dark</Button>
    </div>
  );
};
