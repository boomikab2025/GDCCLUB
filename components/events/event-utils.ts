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
  const offset = /([+-])(\d{2}):(\d{2})$/.exec(value);
  if (offset && (Number(offset[2]) > 23 || Number(offset[3]) > 59)) {
    return null;
  }
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp) : null;
}

export function formatEventDate(value: string, locale: Locale): string | null {
  const date = parseEventDate(value);
  return date
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "UTC",
        timeZoneName: "short",
      }).format(date)
    : null;
}

export function formatEventDateRange(
  startValue: string,
  endValue: string | undefined,
  locale: Locale
): string | null {
  const start = formatEventDate(startValue, locale);
  if (!start) return null;
  const startDate = parseEventDate(startValue);
  const endDate = endValue ? parseEventDate(endValue) : null;
  if (
    !startDate ||
    !endDate ||
    endDate.getTime() <= startDate.getTime()
  ) {
    return start;
  }
  const end = endValue ? formatEventDate(endValue, locale) : null;
  return end ? `${start} – ${end}` : start;
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
  if (event.status === "past") return false;
  const endDate = effectiveEndDate(event);
  return endDate === undefined || endDate > now;
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
