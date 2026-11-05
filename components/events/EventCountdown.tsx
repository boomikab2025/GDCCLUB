"use client";

import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/types";
import { parseEventDate } from "./event-utils";

interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
  inProgress: boolean;
}

function getRemainingTime(
  target: number,
  endTarget?: number,
  now = Date.now()
): RemainingTime {
  const difference = target - now;
  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      started: true,
      inProgress: endTarget !== undefined && endTarget > now,
    };
  }
  const totalSeconds = Math.floor(difference / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    started: false,
    inProgress: false,
  };
}

export function EventCountdown({
  date,
  endDate,
  dict,
  locale,
  now,
}: {
  date: string;
  endDate?: string;
  dict: Dictionary;
  locale: Locale;
  now: number;
}) {
  const target = parseEventDate(date)?.getTime();
  const endTarget = endDate ? parseEventDate(endDate)?.getTime() : undefined;
  const [remaining, setRemaining] = useState<RemainingTime | null>(() =>
    target === undefined ? null : getRemainingTime(target, endTarget, now)
  );

  useEffect(() => {
    if (target === undefined) return;
    const update = () => {
      const next = getRemainingTime(target, endTarget);
      setRemaining(next);
      if (next.started) window.clearInterval(interval);
    };
    const interval = window.setInterval(update, 1000);
    update();
    return () => window.clearInterval(interval);
  }, [target, endTarget]);

  if (target === undefined) return null;
  if (remaining?.inProgress) {
    return <p className="mt-4 font-medium text-accent">{dict.events.eventInProgress}</p>;
  }
  if (remaining?.started) {
    return <p className="text-accent font-medium">{dict.events.eventStarted}</p>;
  }

  const units = [
    { value: remaining?.days, label: dict.events.days },
    { value: remaining?.hours, label: dict.events.hours },
    { value: remaining?.minutes, label: dict.events.minutes },
    { value: remaining?.seconds, label: dict.events.seconds },
  ];
  const formatted = units
    .map(({ value, label }) => `${String(value ?? 0).padStart(2, "0")} ${label}`)
    .join(" : ");

  return (
    <div
      role="timer"
      aria-label={`${dict.events.startsIn}: ${formatted}`}
      lang={locale}
      className="mt-3 rounded-lg border border-accent/15 bg-black/20 px-3 py-2"
    >
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent sm:text-xs">
        {dict.events.startsIn}
      </p>
      <div
        aria-hidden="true"
        className="grid grid-cols-4 gap-1.5 font-mono text-center"
      >
        {units.map(({ value, label }) => (
          <span
            key={label}
            className="flex min-w-0 flex-col items-center rounded-md bg-accent/5 px-1 py-1"
          >
            <span className="text-sm font-semibold leading-5 text-foreground sm:text-base">
              {String(value ?? 0).padStart(2, "0")}
            </span>
            <span className="truncate text-[9px] leading-3 text-muted-foreground sm:text-[10px]">
              {label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
