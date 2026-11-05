"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Gamepad2 } from "lucide-react";
import gamesJson from "@/data/games.json";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/games/GameCard";
import type { Game } from "@/types";

const games = gamesJson as Game[];

export function LatestGames() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{dict.games.title}</h2>
            <p className="text-muted-foreground">{dict.games.subtitle}</p>
          </div>
          {games.length > 0 && (
            <Link
              href={`/${lang}/games/`}
              className="hidden sm:flex items-center gap-2 text-accent hover:underline"
            >
              {dict.common.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>

        {games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-card p-12 text-center"
          >
            <Gamepad2 className="h-12 w-12 text-accent mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-3">{dict.games.comingSoon}</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              {dict.games.comingSoonDesc}
            </p>
            <Link href={`/${lang}/community/`}>
              <Button variant="accent" className="gap-2">
                {dict.community.title}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.slice(0, 3).map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 20,
                  delay: index * 0.1,
                }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
