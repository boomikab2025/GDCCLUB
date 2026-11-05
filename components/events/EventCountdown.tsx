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
      if (next.started && !next.inProgress) window.clearInterval(interval);
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
      className="mt-4"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">
        {dict.events.startsIn}
      </p>
      <div aria-hidden="true" className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-sm sm:text-base">
        {units.map(({ value, label }, index) => (
          <span key={label}>
            {String(value ?? 0).padStart(2, "0")} {label}
            {index < units.length - 1 ? " :" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
