"use client";

import { Label } from "@/components/ui/label";
import { useOutSideClick } from "@/hooks/outside-click";
import { Pencil, Pipette } from "lucide-react";
import { useRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Controller, type Control } from "react-hook-form";
import { type ProfileFormType } from "../types";

const BANNER_PRESET_COLORS = [
  "#3f4046",
  "#b8b8b1",
  "#355d2b",
  "#6a442f",
  "#5a315f",
];

type BannerColorPickerProps = {
  control: Control<ProfileFormType>;
};

export function BannerColorPicker({ control }: BannerColorPickerProps) {
  const [isBannerPickerOpen, setIsBannerPickerOpen] = useState(false);
  const bannerPickerRef = useRef<HTMLDivElement>(null);

  useOutSideClick(bannerPickerRef, () => setIsBannerPickerOpen(false));

  return (
    <div>
      <Label className="text-xs uppercase">Banner color</Label>
      <div className="relative mt-2" ref={bannerPickerRef}>
        <Controller
          name="bannerColor"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <button
                type="button"
                className="relative h-16 w-16 rounded-md border border-[#30333b]"
                style={{ backgroundColor: field.value || "#f472b6" }}
                onClick={() => setIsBannerPickerOpen((prev) => !prev)}
                aria-label="Open banner color picker"
              >
                <Pencil
                  size={12}
                  className="pointer-events-none absolute right-1.5 top-1.5 text-white"
                />
              </button>
              {isBannerPickerOpen && (
                <div className="absolute left-28 top-0 z-20 w-[240px] rounded-lg border border-[#363943] bg-[#1f2129] p-4 shadow-2xl">
                  <HexColorPicker
                    className="banner-color-picker"
                    color={field.value || "#f472b6"}
                    onChange={(nextColor) => field.onChange(nextColor.toLowerCase())}
                  />
                  <div className="relative mt-4">
                    <HexColorInput
                      prefixed
                      color={field.value || "#f472b6"}
                      onChange={(nextColor) => field.onChange(nextColor.toLowerCase())}
                      className="h-12 w-full rounded-lg border border-[#3a3d47] bg-[#20232c] px-4 pr-11 text-base font-semibold text-zinc-100 outline-none"
                    />
                  </div>
                  <div className="mt-4 flex gap-2.5">
                    {BANNER_PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="h-10 w-10 rounded-md border-2 border-[#727684]"
                        style={{ backgroundColor: color }}
                        onClick={() => field.onChange(color)}
                        aria-label={`Use ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {fieldState.error && (
                <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}
