export const DEFAULT_DOWNLOAD_LIMIT = 5;
export const DEFAULT_STREAM_LIMIT = 7;
export const DEFAULT_RENT_DURATION_HOURS = 48;
export const DEFAULT_PURCHASE_ACCESS_DAYS = 30;

export function resolveDownloadLimit(limit?: number | null): number {
  return limit != null && limit > 0 ? limit : DEFAULT_DOWNLOAD_LIMIT;
}
