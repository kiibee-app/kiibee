export function toValidFrom(dateStr?: string): string | null {
  const trimmed = dateStr?.trim();
  if (!trimmed) return null;
  return `${trimmed}T00:00:00.000Z`;
}

export function toValidUntil(dateStr?: string): string | null {
  const trimmed = dateStr?.trim();
  if (!trimmed) return null;
  return `${trimmed}T23:59:59.999Z`;
}

export function toFormDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
