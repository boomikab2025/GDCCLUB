"use client";

import Image from "next/image";
import { useRef } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Gamepad2,
  MapPin,
  Palette,
  Tag,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/types";
import type { ClubEvent } from "@/types/event";
import { Button } from "@/components/ui/button";
import { EventCountdown } from "./EventCountdown";
import {
  formatEventDateRange,
  isEventUpcoming,
  isSafeRegistrationUrl,
} from "./event-utils";
import { useEventTransition } from "./EventTransitionProvider";

export function EventDetails({
  event,
  now,
}: {
  event: ClubEvent;
  now: number;
}) {
  const params = useParams<{ lang: string }>();
  const locale = params.lang as Locale;
  const dict = getDictionary(locale);
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 18]);
  const { backToEvents } = useEventTransition();
  const formattedDate = formatEventDateRange(
    event.date,
    event.endDate,
    locale
  );
  const eventIsUpcoming = isEventUpcoming(event, now);
  const normalizedCategory = event.category.toLowerCase();
  const CategoryIcon: LucideIcon =
    normalizedCategory.split(/[^a-z]+/).includes("art") ||
    normalizedCategory.includes("artwork")
    ? Palette
    : normalizedCategory.includes("tournament") ||
        normalizedCategory.includes("competition")
      ? Trophy
      : normalizedCategory.includes("community") ||
          normalizedCategory.includes("network")
        ? Users
        : Gamepad2;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.18 : 0.4 }}
    >
      <section
        ref={heroRef}
        aria-labelledby="event-title"
        className={`relative flex ${
          event.coverImage
            ? "min-h-[calc(100svh-4rem)]"
            : "min-h-[min(38rem,calc(100svh-4rem))]"
        } items-end overflow-hidden bg-secondary`}
      >
        {event.coverImage ? (
          <motion.div className="absolute -inset-y-6 inset-x-0" style={{ y: imageY }}>
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              sizes="100vw"
              preload
              className="object-cover"
            />
          </motion.div>
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_65%_25%,rgba(212,175,55,0.17),transparent_48%),linear-gradient(135deg,#050505_0%,#11100b_56%,#1d1708_100%)]"
          >
            <div className="absolute left-1/2 top-[12%] -translate-x-1/2 text-accent/20">
              <CategoryIcon
                className="h-36 w-36 sm:h-48 sm:w-48"
                strokeWidth={0.8}
              />
            </div>
            <div className="absolute inset-x-0 top-[38%] h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          </div>
        )}
        <div
          className={`absolute inset-0 ${
            event.coverImage
              ? "bg-gradient-to-t from-black via-black/70 to-black/20"
              : "bg-gradient-to-t from-black/95 via-black/45 to-black/10"
          }`}
        />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12 }}
          className={`relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${
            event.coverImage
              ? "pb-12 pt-24 sm:pb-16"
              : "pb-9 pt-20 sm:pb-12"
          }`}
        >
          <button
            type="button"
            onClick={() => backToEvents(event.slug)}
            className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-white/90 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {dict.events.backToEvents}
          </button>
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-accent/50 bg-black/50 px-3 py-1 text-xs font-semibold text-accent backdrop-blur">
              {eventIsUpcoming ? dict.events.upcoming : dict.events.past}
            </span>
            <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur">
              {event.category}
            </span>
          </div>
          <h1 id="event-title" className="max-w-4xl text-4xl font-bold sm:text-6xl">
            {event.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85 sm:text-xl">
            {event.shortDescription}
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
            <span className="inline-flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-accent" />
              {formattedDate ?? dict.events.dateTba}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-4 w-4 text-accent" />
              {event.venue}
            </span>
            <span className="inline-flex items-center gap-2">
              <Tag aria-hidden="true" className="h-4 w-4 text-accent" />
              {event.category}
            </span>
          </div>
          {eventIsUpcoming && (
            <EventCountdown
              date={event.date}
              endDate={event.endDate}
              dict={dict}
              locale={locale}
              now={now}
            />
          )}
          {isSafeRegistrationUrl(event.registrationUrl) && (
            <Button asChild variant="accent" size="lg" className="mt-8 gap-2">
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.events.registerNow}
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            </Button>
          )}
        </motion.div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          aria-labelledby="event-description-heading"
          className="border-b border-accent/15 pb-12"
        >
          <h2 id="event-description-heading" className="mb-5 text-3xl font-bold">
            {dict.events.details}
          </h2>
          <p className="whitespace-pre-line text-base leading-8 text-muted-foreground sm:text-lg">
            {event.description}
          </p>
        </motion.section>

        {event.gallery && event.gallery.length > 0 && (
          <section aria-labelledby="event-gallery-heading" className="py-12">
            <h2 id="event-gallery-heading" className="mb-6 text-2xl font-bold">
              {dict.events.gallery}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {event.gallery.map((image, index) => (
                <motion.div
                  key={`${image}-${index}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.24) }}
                  className="relative aspect-video overflow-hidden rounded-xl border bg-secondary"
                >
                  <Image
                    src={image}
                    alt={`${event.title} — ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <Button
          variant="outline"
          className="mt-10 gap-2"
          onClick={() => backToEvents(event.slug)}
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {dict.events.backToEvents}
        </Button>
      </div>
    </motion.article>
  );
}
