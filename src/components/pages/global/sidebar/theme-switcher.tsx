'use client';

import React from 'react';
import { MoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
        <MoonIcon className="h-6 w-6 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
          <DropdownMenuRadioItem value="dark">
            Dark Theme
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            Light Theme
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
