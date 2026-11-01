"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowUpRight, Gamepad2, Star } from "lucide-react";
import { Game } from "@/types";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);
  const isComingSoon = game.status === "coming-soon";

  return (
    <Link href={`/${lang}/games/${game.slug}/`}>
      <div className="group relative bg-card border rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
        <div className="aspect-[16/10] overflow-hidden relative bg-muted">
          {game.coverImage ? (
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-accent/20 via-background to-background">
              <Gamepad2 className="h-12 w-12 text-accent/70 mb-2" />
              <span className="text-xs text-muted-foreground">
                {dict.games.comingSoon}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {isComingSoon && (
            <div className="absolute top-3 left-3">
              <Badge variant="default" className="backdrop-blur-sm">
                {dict.games.toBeReleased}
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-accent text-accent-foreground p-2 rounded-sm border border-accent-light/40 shadow-[0_0_16px_rgba(212,175,55,0.25)]">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {game.genre.map((g) => (
              <Badge key={g} variant="outline">
                {g}
              </Badge>
            ))}
          </div>

          <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">
            {game.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {game.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            {isComingSoon ? (
              <span className="text-xs font-medium text-accent">
                {game.releaseYear > 0 ? game.releaseYear : "TBA"}
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{game.rating}</span>
              </div>
            )}
            <div className="flex gap-2 text-muted-foreground">
              {game.platforms.slice(0, 3).map((p) => (
                <span key={p} className="text-xs">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
