import { useMemo } from "react";

interface UseTablePaginationParams<T> {
  data: T[];
  rowsPerPage: number;
  currentPage: number;
  maxRowsPerPage?: number;
}

const DEFAULT_MAX_ROWS_PER_PAGE = 10;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export function useTablePagination<T>({
  data,
  rowsPerPage,
  currentPage,
  maxRowsPerPage = DEFAULT_MAX_ROWS_PER_PAGE,
}: UseTablePaginationParams<T>) {
  const effectiveRowsPerPage = useMemo(() => {
    return clamp(rowsPerPage, 1, maxRowsPerPage);
  }, [rowsPerPage, maxRowsPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / effectiveRowsPerPage));
  }, [data.length, effectiveRowsPerPage]);

  const safeCurrentPage = useMemo(() => {
    return clamp(currentPage, 1, totalPages);
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * effectiveRowsPerPage;
    const endIndex = startIndex + effectiveRowsPerPage;

    return data.slice(startIndex, endIndex);
  }, [data, safeCurrentPage, effectiveRowsPerPage]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  return {
    effectiveRowsPerPage,
    totalPages,
    safeCurrentPage,
    paginatedData,
    pageNumbers,
  };
}
