export const DEFAULT_PAGE_SIZE = 10;

export function getInitialPageSize(
  storageKey?: string,
  fallback = DEFAULT_PAGE_SIZE,
) {
  if (typeof window === "undefined" || !storageKey) return fallback;

  const saved = Number(localStorage.getItem(storageKey));

  return Number.isFinite(saved) && saved > 0 ? saved : fallback;
}

export function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3];
  }

  if (currentPage >= totalPages - 2) {
    return [totalPages - 2, totalPages - 1, totalPages];
  }

  return [currentPage - 1, currentPage, currentPage + 1];
}
