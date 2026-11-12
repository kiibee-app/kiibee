export const DEFAULT_DOWNLOAD_LIMIT = 5;

export function resolveDownloadLimit(limit?: number | null): number {
  return limit != null && limit > 0 ? limit : DEFAULT_DOWNLOAD_LIMIT;
}
