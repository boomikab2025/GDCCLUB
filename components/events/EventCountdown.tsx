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
}

function getRemainingTime(target: number): RemainingTime {
  const difference = target - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  }
  const totalSeconds = Math.floor(difference / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    started: false,
  };
}

export function EventCountdown({
  date,
  dict,
  locale,
}: {
  date: string;
  dict: Dictionary;
  locale: Locale;
}) {
  const target = parseEventDate(date)?.getTime();
  const [remaining, setRemaining] = useState<RemainingTime | null>(null);

  useEffect(() => {
    if (target === undefined) return;
    const update = () => setRemaining(getRemainingTime(target));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  if (target === undefined) return null;
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
