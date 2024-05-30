/* eslint-disable */
import { createSharedPathnamesNavigation } from "next-intl/navigation";

const locales = ["en", "ka"] as const;

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
