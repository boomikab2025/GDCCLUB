import { Dictionary, Locale } from "@/types";

import en from "./en";
import ta from "./ta";
import hi from "./hi";
import fr from "./fr";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ta,
  hi,
  fr,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}
