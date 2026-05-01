"use client";

import { useMemo, useState } from "react";

interface UsePaginationOptions {
  totalItems: number;
  initialPageSize?: number;
}

export function usePagination<T>({
  data,
  totalItems,
  initialPageSize = 5,
}: UsePaginationOptions & { data: T[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = data.slice(startIndex, endIndex);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (safePage <= 3) {
      return [1, 2, 3];
    }

    if (safePage >= totalPages - 2) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [safePage - 1, safePage, safePage + 1];
  }, [safePage, totalPages]);

  const onPageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
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
