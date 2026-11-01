import { Dictionary, Locale } from "@/types";

import en from "./en";
import ta from "./ta";
import ru from "./ru";
import hi from "./hi";
import zh from "./zh";
import ja from "./ja";
import de from "./de";
import es from "./es";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ta,
  ru,
  hi,
  zh,
  ja,
  de,
  es,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}