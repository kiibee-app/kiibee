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
