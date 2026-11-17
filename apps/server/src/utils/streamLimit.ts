export const DEFAULT_RENTAL_STREAM_LIMIT = 7;

export function resolveStreamLimit(value?: number | null): number {
  return value != null && Number.isInteger(value) && value >= 1 && value <= 10
    ? value
    : DEFAULT_RENTAL_STREAM_LIMIT;
}
