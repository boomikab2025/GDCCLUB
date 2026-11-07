"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Dictionary, Locale } from "@/types";
import type { ClubEvent } from "@/types/event";
import { EventCard } from "./EventCard";

export interface EventTimelineGroup {
  id: string;
  title: string;
  emptyMessage: string;
  events: ClubEvent[];
}

function TimelineBridge({
  fromLeft,
  label,
  headingId,
}: {
  fromLeft: boolean;
  label?: string;
  headingId?: string;
}) {
  const start = fromLeft ? "left-2/3" : "left-1/3";
  const end = fromLeft ? "left-1/3" : "left-2/3";

  return (
    <div className="relative py-5 md:h-28 md:py-0">
      <div
        aria-hidden="true"
        className={`absolute top-0 hidden h-[42%] w-px -translate-x-1/2 bg-accent/70 md:block ${start}`}
      />
      <div
        aria-hidden="true"
        className="absolute top-[42%] right-1/3 left-1/3 hidden h-px bg-accent/70 md:block"
      />
      <div
        aria-hidden="true"
        className={`absolute top-[42%] bottom-0 hidden w-px -translate-x-1/2 bg-accent/70 md:block ${end}`}
      />
      {label && headingId ? (
        <h2
          id={headingId}
          className="relative z-10 ml-8 inline-flex rounded-full border border-accent/40 bg-background px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent shadow-[0_0_24px_rgba(59,130,246,0.18)] md:absolute md:top-[42%] md:left-1/2 md:ml-0 md:-translate-x-1/2 md:-translate-y-1/2"
        >
          {label}
        </h2>
      ) : null}
    </div>
  );
}

export function EventSection({
  groups,
  dict,
  locale,
  now,
}: {
  groups: EventTimelineGroup[];
  dict: Dictionary;
  locale: Locale;
  now: number;
}) {
  const reduceMotion = useReducedMotion();
  let eventIndex = 0;
  const rendered = groups.map((group, groupIndex) => {
    const headingSideIsLeft = eventIndex % 2 === 0;
    const previousGroupHasEvents =
      groupIndex > 0 && groups[groupIndex - 1].events.length > 0;
    const showHeadingAbove = !previousGroupHasEvents || group.events.length === 0;
    const items = group.events.map((event, index) => {
      const isLeft = eventIndex % 2 === 0;
      const isLastInGroup = index === group.events.length - 1;
      const laterGroup = groups.slice(groupIndex + 1).find((item) => item.events.length > 0);
      const hasNext = !isLastInGroup || Boolean(laterGroup);
      const bridgeLabel = isLastInGroup && laterGroup ? laterGroup.title : undefined;
      const bridgeHeadingId =
        isLastInGroup && laterGroup ? `${laterGroup.id}-heading` : undefined;
      const currentIndex = eventIndex;
      eventIndex += 1;
      return { event, isLeft, hasNext, bridgeLabel, bridgeHeadingId, currentIndex };
    });
    return { group, headingSideIsLeft, showHeadingAbove, items };
  });

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[11px] top-0 w-px -translate-x-1/2 bg-accent/40 md:hidden"
      />
      {rendered.map(({ group, headingSideIsLeft, showHeadingAbove, items }) => (
        <motion.section
          key={group.id}
          id={group.id}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 py-6"
          aria-labelledby={`${group.id}-heading`}
        >
          {showHeadingAbove && (
            <div
              className={`relative mb-4 pl-8 md:pl-0 ${
                headingSideIsLeft ? "md:w-2/3" : "md:ml-auto md:w-2/3"
              }`}
            >
              <h2
                id={`${group.id}-heading`}
                className="inline-flex rounded-full border border-accent/40 bg-background px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent shadow-[0_0_24px_rgba(59,130,246,0.18)]"
              >
                {group.title}
              </h2>
            </div>
          )}

          {items.length === 0 ? (
            <div className="relative pl-8 md:mx-auto md:max-w-xl md:pl-0">
              <div className="rounded-2xl border border-dashed border-accent/30 bg-card/60 px-6 py-8 text-center">
                <p className="text-sm text-muted-foreground">{group.emptyMessage}</p>
              </div>
            </div>
          ) : (
            <ol>
              {items.map(
                ({ event, isLeft, hasNext, bridgeLabel, bridgeHeadingId, currentIndex }) => (
                  <li key={event.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute left-[11px] top-8 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-background shadow-[0_0_12px_rgba(59,130,246,0.75)] md:hidden"
                    />
                    <div
                      className={`relative pl-8 md:pl-0 ${
                        isLeft ? "md:w-2/3" : "md:ml-auto md:w-2/3"
                      }`}
                    >
                      {currentIndex > 0 && (
                        <span
                          aria-hidden="true"
                          className={`absolute top-0 z-10 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 border-accent bg-background shadow-[0_0_12px_rgba(59,130,246,0.75)] md:block ${
                            isLeft ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
                          }`}
                        />
                      )}
                      {hasNext && (
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-0 z-10 hidden h-3 w-3 translate-y-1/2 rounded-full border-2 border-accent bg-background shadow-[0_0_12px_rgba(59,130,246,0.75)] md:block ${
                            isLeft ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
                          }`}
                        />
                      )}
                      <EventCard
                        event={event}
                        dict={dict}
                        locale={locale}
                        index={currentIndex}
                        now={now}
                        side={isLeft ? "left" : "right"}
                      />
                    </div>
                    {hasNext && (
                      <TimelineBridge
                        fromLeft={isLeft}
                        label={bridgeLabel}
                        headingId={bridgeHeadingId}
                      />
                    )}
                  </li>
                )
              )}
            </ol>
          )}
        </motion.section>
      ))}
    </div>
  );
}
