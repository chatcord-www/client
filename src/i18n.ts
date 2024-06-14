/* eslint-disable */
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "ka"];
type ArrayToUnion<T extends readonly string[]> = T[number];

export type LocalesType = ArrayToUnion<typeof locales>;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as string)) return notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
