export const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromISO(iso?: string) {
  if (!iso) return null;
  const parts = iso.split("-").map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
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

export function formatDateSlashShort(iso?: string) {
  if (!iso) return "";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
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
}

const MM_YYYY = /^(\d{2})\/(\d{4})$/;
const MM_YY = /^(\d{2})\/(\d{2})$/;
const YYYY_MM = /^(\d{4})-(\d{2})/;

export function formatCardExpiry(dateString?: string | null): string {
  if (!dateString) return "";
  const value = dateString.trim();

  if (MM_YYYY.test(value)) return value;

  const mmYy = value.match(MM_YY);
  if (mmYy) {
    const [, month, year] = mmYy;
    return `${month}/20${year}`;
  }

  const yyyyMm = value.match(YYYY_MM);
  if (yyyyMm) {
    const [, year, month] = yyyyMm;
    return `${month}/${year}`;
  }

  const parsedDate = new Date(value);
  if (!Number.isNaN(parsedDate.getTime())) {
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = String(parsedDate.getFullYear());
    return `${month}/${year}`;
  }

  return value;
}

export function convertRentDurationHoursToMonths(
  hours?: number | null,
): number {
  if (!hours) return 0;
  return Math.round(hours / (30 * 24));
}

export function calculateRentalExpiryDate(
  durationHours?: number | null,
): string | undefined {
  if (!durationHours) return undefined;
  return new Date(Date.now() + durationHours * 3_600_000).toISOString();
}

export function formatTimeAgoByLang(
  timeString?: string | null,
  language?: string,
): string {
  if (!timeString) return "";
  const trimmed = timeString.trim();
  if (!trimmed) return "";

  const isEn =
    language === "en" ||
    (typeof document !== "undefined" && document.documentElement.lang === "en");

  const danishMatch = trimmed.match(
    /^For\s+(\d+)\s+(sekund|sekunder|minut|minutter|time|timer|dag|dage|måned|måneder|år)\s+siden$/i,
  );
  if (danishMatch) {
    if (!isEn) return trimmed;
    const count = parseInt(danishMatch[1], 10);
    const unit = danishMatch[2].toLowerCase();
    if (unit.startsWith("sekund"))
      return `${count} second${count !== 1 ? "s" : ""} ago`;
    if (unit.startsWith("minut"))
      return `${count} minute${count !== 1 ? "s" : ""} ago`;
    if (unit.startsWith("time"))
      return `${count} hour${count !== 1 ? "s" : ""} ago`;
    if (unit.startsWith("dag"))
      return `${count} day${count !== 1 ? "s" : ""} ago`;
    if (unit.startsWith("måned"))
      return `${count} month${count !== 1 ? "s" : ""} ago`;
    if (unit.startsWith("år"))
      return `${count} year${count !== 1 ? "s" : ""} ago`;
  }

  const englishMatch = trimmed.match(
    /^(\d+)\s+(second|minute|hour|day|month|year)s?\s+ago$/i,
  );
  if (englishMatch) {
    if (isEn) return trimmed;
    const count = parseInt(englishMatch[1], 10);
    const unit = englishMatch[2].toLowerCase();
    if (unit === "second")
      return count <= 1 ? "For 1 sekund siden" : `For ${count} sekunder siden`;
    if (unit === "minute")
      return count === 1 ? "For 1 minut siden" : `For ${count} minutter siden`;
    if (unit === "hour")
      return count === 1 ? "For 1 time siden" : `For ${count} timer siden`;
    if (unit === "day")
      return count === 1 ? "For 1 dag siden" : `For ${count} dage siden`;
    if (unit === "month")
      return count === 1 ? "For 1 måned siden" : `For ${count} måneder siden`;
    if (unit === "year")
      return count === 1 ? "For 1 år siden" : `For ${count} år siden`;
  }

  return trimmed;
}

export const localizeTimeAgo = formatTimeAgoByLang;
