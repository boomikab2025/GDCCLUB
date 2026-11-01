import { Locale } from "@/types";

export const i18n = {
  defaultLocale: "en" as Locale,
  locales: ["en", "ta", "ru", "hi", "zh", "ja", "de", "es"] as Locale[],
};

export type { Locale };

export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}