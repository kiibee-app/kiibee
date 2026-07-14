export const parseRentDurationToHours = (
  rentDuration: string | number | null | undefined,
) => {
  if (rentDuration == null) return null;

  const value = String(rentDuration).trim();
  if (!value) return null;

  const monthMatch = value.match(/^(\d+)_months?$/);
  if (monthMatch) return Number(monthMatch[1]) * 30 * 24;

  const hours = Number(value);
  return Number.isFinite(hours) && hours > 0 ? hours : null;
};
