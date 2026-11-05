"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/types";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang as Locale;
  const dict = getDictionary(lang);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        {dict.events.title}
      </p>
      <h1 className="text-3xl font-bold sm:text-4xl">{dict.events.notFound}</h1>
      <Button asChild variant="outline" className="mt-8 gap-2">
        <Link href={`/${lang}/events/`}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {dict.events.backToEvents}
        </Link>
      </Button>
    </main>
  );
}
