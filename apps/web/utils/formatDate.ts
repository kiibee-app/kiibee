export function formatDate(iso?: string) {
  if (!iso) return "";

  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
  } catch {
    return "";
  }
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

export function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function fromISO(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDateUSShort(iso?: string) {
  if (!iso) return "";

  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ORDINAL_SUFFIXES = new Map([
  ["one", "st"],
  ["two", "nd"],
  ["few", "rd"],
  ["other", "th"],
]);

export function formatJoinedDate(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString(undefined, { month: "short" });
  const suffix =
    ORDINAL_SUFFIXES.get(
      new Intl.PluralRules(undefined, { type: "ordinal" }).select(day),
    ) ?? "th";

  return `${day}${suffix} ${month} ${year}`;
}

export function convertRentDurationToHours(
  rentDuration: string | null | undefined,
): number | null {
  if (!rentDuration) return null;
  const match = rentDuration.match(/^(\d+)_months?$/);
  if (match) return Number(match[1]) * 30 * 24;
  const num = Number(rentDuration);
  return Number.isFinite(num) ? num : null;
}

export interface CalendarDay {
  date: Date;
  iso: string;
  isOutside: boolean;
}

export function getCalendarDays(monthDate: Date): CalendarDay[] {
  const days: CalendarDay[] = [];

  const firstDay = startOfMonth(monthDate);
  const total = daysInMonth(monthDate);
  const startWeekday = firstDay.getDay();

  for (let i = 0; i < startWeekday; i++) {
    days.push({ date: new Date(0), iso: "", isOutside: true });
  }

  for (let d = 1; d <= total; d++) {
    const dt = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
    days.push({ date: dt, iso: toISO(dt), isOutside: false });
  }

  return days;
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  } as const);
export function formatCardExpiry(dateString?: string | null): string {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length >= 2 && parts[0].length === 4) {
    const year = parts[0].slice(-2);
    const month = parts[1];
    return `${month}/${year}`;
  }
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
  }
  return dateString;
}
