"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import gamesJson from "@/data/games.json";
import { GameCard } from "@/components/games/GameCard";
import { GameFilters } from "@/components/games/GameFilters";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import type { Game } from "@/types";

const games = gamesJson as Game[];

export default function GamesPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);

  const [filters, setFilters] = useState({
    genre: "All",
    platform: "All",
    year: "All",
  });

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const genreMatch =
        filters.genre === "All" || game.genre.includes(filters.genre);
      const platformMatch =
        filters.platform === "All" || game.platforms.includes(filters.platform);
      const yearMatch =
        filters.year === "All" || game.releaseYear.toString() === filters.year;
      return genreMatch && platformMatch && yearMatch;
    });
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{dict.games.title}</h1>
        <p className="text-lg text-muted-foreground">{dict.games.subtitle}</p>
      </motion.div>

      {games.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-12 sm:p-16 text-center"
        >
          <Gamepad2 className="h-14 w-14 text-accent mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {dict.games.comingSoon}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {dict.games.comingSoonDesc}
          </p>
          <Link href={`/${lang}/community/`}>
            <Button variant="accent">{dict.community.discordCta}</Button>
          </Link>
        </motion.div>
      ) : (
        <>
          <GameFilters onFilterChange={setFilters} />

          {filteredGames.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              {dict.common.notFound}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 20,
                    delay: index * 0.05,
                  }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
