"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/types";
import type { ClubEvent } from "@/types/event";
import { EventParticles } from "./EventParticles";
import { EventSection } from "./EventSection";
import { useEventTransition } from "./EventTransitionProvider";
import { splitEvents } from "./event-utils";

export function EventsListing({
  events,
  now: initialNow,
}: {
  events: ClubEvent[];
  now: number;
}) {
  const params = useParams<{ lang: string }>();
  const locale = params.lang as Locale;
  const dict = getDictionary(locale);
  const reduceMotion = useReducedMotion();
  const [now, setNow] = useState(initialNow);
  const { isListingTransitioning } = useEventTransition();
  const sections = splitEvents(events, now);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isListingTransitioning ? 0.18 : 1 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.68 }}
      className="relative isolate overflow-hidden"
    >
      <section
        aria-labelledby="events-title"
        className="relative flex min-h-[36rem] items-center overflow-hidden border-b border-accent/10 bg-[radial-gradient(ellipse_at_50%_10%,rgba(212,175,55,0.12),transparent_58%)] px-4 py-20 sm:px-6 lg:px-8"
      >
        <EventParticles />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative mx-auto w-full max-w-7xl text-center"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            GDCVITC
          </p>
          <h1
            id="events-title"
            className="text-5xl font-bold tracking-tight sm:text-7xl"
          >
            {dict.events.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {dict.events.description}
          </p>
          <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EventSection
          id="upcoming-events"
          title={dict.events.upcoming}
          emptyMessage={dict.events.noUpcoming}
          events={sections.upcoming}
          dict={dict}
          locale={locale}
        />
        <div
          aria-hidden="true"
          className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
        />
        <EventSection
          id="past-events"
          title={dict.events.past}
          emptyMessage={dict.events.noPast}
          events={sections.past}
          dict={dict}
          locale={locale}
        />
      </div>
      </motion.div>
  );
}
