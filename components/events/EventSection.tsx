"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Dictionary, Locale } from "@/types";
import type { ClubEvent } from "@/types/event";
import { EventCard } from "./EventCard";

export function EventSection({
  id,
  title,
  emptyMessage,
  events,
  dict,
  locale,
  now,
}: {
  id: string;
  title: string;
  emptyMessage: string;
  events: ClubEvent[];
  dict: Dictionary;
  locale: Locale;
  now: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="mb-8 text-3xl font-bold sm:mb-10 sm:text-4xl"
      >
        {title}
      </h2>
      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card/60 px-6 py-12 text-center sm:px-12">
          <p className="mx-auto max-w-xl text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div
          className={
            events.length === 1
              ? "grid grid-cols-1 justify-items-center"
              : events.length === 2
                ? "mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2"
                : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          }
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              className={events.length === 1 ? "w-full max-w-2xl" : undefined}
            >
              <EventCard
                event={event}
                dict={dict}
                locale={locale}
                index={index}
                now={now}
              />
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
