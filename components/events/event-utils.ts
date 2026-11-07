import type { Locale } from "@/types";
import type { ClubEvent } from "@/types/event";

const ISO_DATE_WITH_TIMEZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;
const EVENT_TIME_ZONE = "Asia/Kolkata";

export function parseEventDate(value: string): Date | null {
  const parts =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(value);
  if (!ISO_DATE_WITH_TIMEZONE.test(value) || !parts) return null;
  const [, year, month, day, hour, minute, second = "0"] = parts;
  if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) {
    return null;
  }
  const daysInMonth = new Date(
    Date.UTC(Number(year), Number(month), 0)
  ).getUTCDate();
  if (
    Number(month) < 1 ||
    Number(month) > 12 ||
    Number(day) < 1 ||
    Number(day) > daysInMonth
  ) {
    return null;
  }
  const offset = /([+-])(\d{2}):(\d{2})$/.exec(value);
  if (offset && (Number(offset[2]) > 23 || Number(offset[3]) > 59)) {
    return null;
  }
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp) : null;
}

function formatInEventZone(
  date: Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: EVENT_TIME_ZONE,
  }).format(date);
}

function sameEventDay(first: Date, second: Date) {
  return (
    formatInEventZone(first, "en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) ===
    formatInEventZone(second, "en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  );
}

const shortDateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const shortTimeOptions: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
};

export function formatEventDate(value: string, locale: Locale): string | null {
  const date = parseEventDate(value);
  if (!date) return null;
  return `${formatInEventZone(date, locale, shortDateOptions)}, ${formatInEventZone(date, locale, shortTimeOptions)}`;
}

export function formatEventDateRange(
  startValue: string,
  endValue: string | undefined,
  locale: Locale
): string | null {
  const startDate = parseEventDate(startValue);
  if (!startDate) return null;
  const startDateLabel = formatInEventZone(startDate, locale, shortDateOptions);
  const startTimeLabel = formatInEventZone(startDate, locale, shortTimeOptions);
  const endDate = endValue ? parseEventDate(endValue) : null;
  if (!endDate || endDate.getTime() <= startDate.getTime()) {
    return `${startDateLabel}, ${startTimeLabel}`;
  }
  const endTimeLabel = formatInEventZone(endDate, locale, shortTimeOptions);
  if (sameEventDay(startDate, endDate)) {
    return `${startDateLabel} · ${startTimeLabel} – ${endTimeLabel}`;
  }
  const endDateLabel = formatInEventZone(endDate, locale, shortDateOptions);
  return `${startDateLabel}, ${startTimeLabel} – ${endDateLabel}, ${endTimeLabel}`;
}

export function getCurrentTimestamp(): number {
  return Date.now();
}

export function isSafeRegistrationUrl(value?: string): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.length > 0 &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function effectiveEndDate(event: ClubEvent): number | undefined {
  const start = parseEventDate(event.date)?.getTime();
  if (start === undefined) return undefined;
  const end = event.endDate ? parseEventDate(event.endDate)?.getTime() : undefined;
  return end !== undefined && end >= start ? end : start;
}

export function isEventUpcoming(event: ClubEvent, now: number): boolean {
  const startDate = parseEventDate(event.date)?.getTime();
  if (startDate === undefined) return event.status === "upcoming";
  const endDate = effectiveEndDate(event);
  return endDate !== undefined && endDate > now;
}

export function splitEvents(events: ClubEvent[], now = Date.now()) {
  const normalizedEvents = events.map((event) => ({
    ...event,
    status: isEventUpcoming(event, now) ? "upcoming" as const : "past" as const,
  }));
  const sortByDate =
    (direction: 1 | -1) => (first: ClubEvent, second: ClubEvent) => {
      const firstDate = effectiveEndDate(first);
      const secondDate = effectiveEndDate(second);
      if (firstDate === undefined) return secondDate === undefined ? 0 : 1;
      if (secondDate === undefined) return -1;
      return (firstDate - secondDate) * direction;
    };
  return {
    upcoming: normalizedEvents
      .filter((event) => event.status === "upcoming")
      .sort(sortByDate(1)),
    past: normalizedEvents
      .filter((event) => event.status === "past")
      .sort(sortByDate(-1)),
  };
}
