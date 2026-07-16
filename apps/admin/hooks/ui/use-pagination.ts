import { useMemo, useState } from "react";
import { getInitialPageSize, getPageNumbers } from "../../utils/pagination";

interface UsePaginationOptions {
  totalItems: number;
  initialPageSize?: number;
  storageKey?: string;
  mode?: "client" | "server";
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function usePagination<T>({
  data,
  totalItems,
  initialPageSize = 5,
  storageKey,
  mode = "client",
  currentPage: controlledCurrentPage,
  pageSize: controlledPageSize,
  onPageChange: controlledOnPageChange,
  onPageSizeChange: controlledOnPageSizeChange,
}: UsePaginationOptions & { data: T[] }) {
  const [uncontrolledCurrentPage, setUncontrolledCurrentPage] = useState(1);
  const [uncontrolledPageSize, setUncontrolledPageSize] = useState(() =>
    getInitialPageSize(storageKey, initialPageSize),
  );

  const currentPage = controlledCurrentPage ?? uncontrolledCurrentPage;
  const pageSize = controlledPageSize ?? uncontrolledPageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(
    startIndex + (mode === "server" ? data.length : pageSize),
    totalItems,
  );
  const paginatedData =
    mode === "server" ? data : data.slice(startIndex, endIndex);

  const pageNumbers = useMemo(
    () => getPageNumbers(safePage, totalPages),
    [safePage, totalPages],
  );

  const onPageChange = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);

    if (controlledOnPageChange) {
      controlledOnPageChange(nextPage);
      return;
    }

    setUncontrolledCurrentPage(nextPage);
  };

  const onPageSizeChange = (size: number) => {
    if (controlledOnPageSizeChange) {
      controlledOnPageSizeChange(size);
    } else {
      setUncontrolledPageSize(size);
    }

    if (controlledOnPageChange) {
      controlledOnPageChange(1);
    } else {
      setUncontrolledCurrentPage(1);
    }

    if (storageKey) {
      try {
        localStorage.setItem(storageKey, String(size));
      } catch (error) {
        console.error("Error saving pageSize to localStorage:", error);
      }
    }
  };

  return {
    currentPage: safePage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    pageNumbers,
    paginatedData,
    onPageChange,
    onPageSizeChange,
  };
}
