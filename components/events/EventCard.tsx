"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import type { Dictionary, Locale } from "@/types";
import type { ClubEvent } from "@/types/event";
import { EventCountdown } from "./EventCountdown";
import { formatEventDate } from "./event-utils";
import { useEventTransition } from "./EventTransitionProvider";

export function EventCard({
  event,
  dict,
  locale,
  index,
}: {
  event: ClubEvent;
  dict: Dictionary;
  locale: Locale;
  index: number;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-8, 8]);
  const { openEvent } = useEventTransition();
  const formattedDate = formatEventDate(event.date, locale);

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
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles aria-hidden="true" className="h-12 w-12 text-accent/70" />
            </div>
          )}
          <div className="absolute left-4 top-4">
            <span className="rounded-full border border-accent/40 bg-black/70 px-3 py-1 text-xs font-medium text-accent backdrop-blur">
              {event.status === "upcoming" ? dict.events.upcoming : dict.events.past}
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
          {event.status === "upcoming" && (
            <EventCountdown date={event.date} dict={dict} locale={locale} />
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
