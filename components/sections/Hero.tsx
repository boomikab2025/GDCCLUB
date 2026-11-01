"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function Hero() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-6 text-[11px] font-semibold tracking-[0.22em] uppercase border border-accent/50 bg-black text-accent shadow-[inset_0_1px_0_rgba(240,215,140,0.15),0_0_20px_rgba(212,175,55,0.12)]">
            <span className="h-1.5 w-1.5 rotate-45 bg-accent shrink-0" aria-hidden />
            {dict.hero.badge}
            <span className="h-1.5 w-1.5 rotate-45 bg-accent shrink-0" aria-hidden />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-wide mb-6"
        >
          <span className="text-gradient">{dict.hero.tagline}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          {dict.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href={`/${lang}/games/`}>
            <Button size="lg" variant="accent" className="gap-2 text-base">
              {dict.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/${lang}/community/`}>
            <Button size="lg" variant="outline" className="gap-2 text-base">
              <Users className="h-4 w-4" />
              {dict.hero.ctaSecondary}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
