export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export function getSafePositiveInteger(
  value: number | undefined,
  fallback: number,
  max?: number,
) {
  if (!Number.isFinite(value)) return fallback;

  const integer = Math.floor(value as number);
  const safeInteger = integer > 0 ? integer : fallback;

  return max ? Math.min(safeInteger, max) : safeInteger;
}
