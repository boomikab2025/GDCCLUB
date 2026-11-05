"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  CalendarDays,
  Gamepad2,
  MapPin,
  Palette,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary, Locale } from "@/types";
import type { ClubEvent } from "@/types/event";
import { EventCountdown } from "./EventCountdown";
import { formatEventDateRange, isEventUpcoming } from "./event-utils";
import { useEventTransition } from "./EventTransitionProvider";

export function EventCard({
  event,
  dict,
  locale,
  index,
  now,
}: {
  event: ClubEvent;
  dict: Dictionary;
  locale: Locale;
  index: number;
  now: number;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-8, 8]);
  const { openEvent } = useEventTransition();
  const formattedDate = formatEventDateRange(event.date, event.endDate, locale);
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
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.28) }}
      className="motion-card group overflow-hidden rounded-2xl border bg-card"
    >
      <button
        type="button"
        onClick={() =>
          openEvent(event, imageRef.current?.getBoundingClientRect())
        }
        aria-label={`${dict.events.viewEvent}: ${event.title}`}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      >
        <div
          ref={imageRef}
          data-event-image={event.slug}
          className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-accent/15 via-secondary to-background"
        >
          {event.coverImage ? (
            <motion.div
              className="absolute -inset-y-3 inset-x-0"
              style={{ y: imageY }}
            >
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </motion.div>
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_65%_25%,rgba(212,175,55,0.17),transparent_48%),linear-gradient(135deg,#050505_0%,#11100b_56%,#1d1708_100%)]"
            >
              <div className="absolute inset-0 flex items-center justify-center text-accent/25">
                <CategoryIcon
                  className="h-16 w-16 sm:h-20 sm:w-20"
                  strokeWidth={0.9}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
              <Sparkles
                aria-hidden="true"
                className="absolute bottom-4 right-4 h-4 w-4 text-accent/70"
              />
            </div>
          )}
          <div className="absolute left-4 top-4">
            <span className="rounded-full border border-accent/40 bg-black/70 px-3 py-1 text-xs font-medium text-accent backdrop-blur">
              {eventIsUpcoming ? dict.events.upcoming : dict.events.past}
            </span>
          </div>
        </div>

        <div className="space-y-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-accent" />
              {formattedDate ?? dict.events.dateTba}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-4 w-4 text-accent" />
              {event.venue}
            </span>
          </div>
          <h3 className="text-xl font-semibold transition-colors group-hover:text-accent">
            {event.title}
          </h3>
          <p className="text-sm text-accent">{event.category}</p>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {event.shortDescription}
          </p>
          {eventIsUpcoming && (
            <EventCountdown
              date={event.date}
              endDate={event.endDate}
              dict={dict}
              locale={locale}
              now={now}
            />
          )}
          <span className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-accent">
            {dict.events.viewEvent}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </button>
    </motion.article>
  );
}
