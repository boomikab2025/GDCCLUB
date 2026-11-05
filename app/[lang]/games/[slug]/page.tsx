"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Calendar,
  Monitor,
  ArrowLeft,
  ExternalLink,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import gamesJson from "@/data/games.json";
import type { Game } from "@/types";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const games = gamesJson as Game[];

function isLiveLink(url?: string) {
  return Boolean(url && url !== "#");
}

export default function GameDetailPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const slug = params.slug as string;
  const dict = getDictionary(lang);

  const game = games.find((g) => g.slug === slug);

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">{dict.common.notFound}</h1>
        <Link href={`/${lang}/games/`}>
          <Button variant="outline">{dict.games.title}</Button>
        </Link>
      </div>
    );
  }

  const status = game.status ?? "released";
  const isReleased = status === "released";
  const statusLabel =
    status === "released"
      ? dict.games.released
      : status === "coming-soon"
        ? dict.games.toBeReleased
        : dict.games.inDevelopment;
  const storeLinks = [
    { key: "Steam", href: game.links.steam },
    { key: "Epic Games", href: game.links.epic },
    { key: "GOG", href: game.links.gog },
    { key: "itch.io", href: game.links.itch },
    { key: "Website", href: game.links.website },
    { key: "GitHub", href: game.links.github },
  ].filter((l) => isLiveLink(l.href));

  return (
    <div className="min-h-screen">
      <div
        className="relative h-[60vh] bg-cover bg-center bg-muted"
        style={
          game.coverImage
            ? { backgroundImage: `url(${game.coverImage})` }
            : undefined
        }
      >
        {!game.coverImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/15 via-background to-background">
            <Gamepad2 className="h-24 w-24 text-accent/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Link
            href={`/${lang}/games/`}
            className="motion-nav-link inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {dict.games.title}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default">{statusLabel}</Badge>
              {game.genre.map((g) => (
                <Badge key={g} variant="outline">
                  {g}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">{game.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-6">
              {game.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              {isReleased && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{game.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {!isReleased
                  ? `${statusLabel}${
                      game.releaseYear > 0 ? ` · ${game.releaseYear}` : " · TBA"
                    }`
                  : game.releaseYear}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Monitor className="h-4 w-4" />
                {game.platforms.join(", ")}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.85 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="story" className="mb-12">
              <TabsList className="mb-6">
                <TabsTrigger value="story">{dict.games.story}</TabsTrigger>
                <TabsTrigger value="features">{dict.games.features}</TabsTrigger>
                <TabsTrigger value="requirements">
                  {dict.games.requirements}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="space-y-4">
                <p className="text-lg leading-relaxed">{game.longDescription}</p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {game.story}
                </p>
              </TabsContent>

              <TabsContent value="features">
                <ul className="space-y-3">
                  {game.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="requirements">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4 text-muted-foreground">
                      Minimum
                    </h3>
                    <dl className="space-y-2">
                      {Object.entries(game.systemRequirements.minimum).map(
                        ([key, value]) => (
                          <div key={key}>
                            <dt className="text-sm text-muted-foreground">
                              {key}
                            </dt>
                            <dd className="font-medium">{value}</dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4 text-muted-foreground">
                      Recommended
                    </h3>
                    <dl className="space-y-2">
                      {Object.entries(game.systemRequirements.recommended).map(
                        ([key, value]) => (
                          <div key={key}>
                            <dt className="text-sm text-muted-foreground">
                              {key}
                            </dt>
                            <dd className="font-medium">{value}</dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {game.screenshots.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">
                  {dict.games.screenshots}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {game.screenshots.map((screenshot, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="aspect-video rounded-lg overflow-hidden"
                    >
                      <img
                        src={screenshot}
                        alt={`${game.title} screenshot ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="motion-card p-6 rounded-xl border bg-card sticky top-24">
              <h3 className="font-bold text-lg mb-4">
                {isReleased ? dict.games.buyNow : statusLabel}
              </h3>

              {!isReleased && (
                <p className="text-sm text-muted-foreground mb-4">
                  {dict.games.comingSoonDesc}
                </p>
              )}

              <div className="space-y-3">
                {storeLinks.length === 0 ? (
                  <Button className="w-full" variant="outline" disabled>
                    {isReleased ? dict.games.buyNow : statusLabel}
                  </Button>
                ) : (
                  storeLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        className="w-full gap-2 mb-2"
                        variant={link.key === "GitHub" ? "outline" : "accent"}
                      >
                        <ExternalLink className="h-4 w-4" />
                        {link.key}
                      </Button>
                    </a>
                  ))
                )}
              </div>

              {game.awards && game.awards.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-sm mb-3">Awards</h4>
                  <ul className="space-y-2">
                    {game.awards.map((award) => (
                      <li
                        key={award}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <Star className="h-3 w-3 text-accent" />
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
