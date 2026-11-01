"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { Locale, i18n } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Globe, Check } from "lucide-react";

const localeNames: Record<Locale, string> = {
  en: "English",
  ta: "தமிழ்",
  ru: "Русский",
  hi: "हिन्दी",
  zh: "中文",
  ja: "日本語",
  de: "Deutsch",
  es: "Español",
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLang = (params.lang as Locale) || "en";

  const handleLocaleChange = (locale: Locale) => {
    const newPath = pathname.replace(`/${currentLang}`, `/${locale}`);
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{localeNames[currentLang]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover border rounded-md shadow-lg p-1">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className="flex items-center justify-between px-3 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer"
          >
            {localeNames[locale]}
            {currentLang === locale && <Check className="h-4 w-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}