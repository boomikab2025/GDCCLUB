import type { Locale } from "@/types";
import type { ClubEvent } from "@/types/event";

const ISO_DATE_WITH_TIMEZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;

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
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp) : null;
}

export function formatEventDate(value: string, locale: Locale): string | null {
  const date = parseEventDate(value);
  return date
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeStyle: "short",
      }).format(date)
    : null;
}

export function isSafeRegistrationUrl(value?: string): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function splitEvents(events: ClubEvent[]) {
  const sortByDate =
    (direction: 1 | -1) => (first: ClubEvent, second: ClubEvent) => {
      const firstDate = parseEventDate(first.date)?.getTime();
      const secondDate = parseEventDate(second.date)?.getTime();
      if (firstDate === undefined) return secondDate === undefined ? 0 : 1;
      if (secondDate === undefined) return -1;
      return (firstDate - secondDate) * direction;
    };
  return {
    upcoming: events
      .filter((event) => event.status === "upcoming")
      .sort(sortByDate(1)),
    past: events.filter((event) => event.status === "past").sort(sortByDate(-1)),
  };
}
