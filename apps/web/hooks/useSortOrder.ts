import { useMemo, useState } from "react";
import { SORT_DIRECTIONS, type SortDirectionWithNone } from "@/utils/ui";

interface UseSortOrderConfig<T> {
  targetHeader: string;
  sortBy: (item: T) => string | number;
}

export function useSortOrder<T>(
  data: T[],
  { targetHeader, sortBy }: UseSortOrderConfig<T>,
) {
  const [sortDirection, setSortDirection] = useState<SortDirectionWithNone>(
    SORT_DIRECTIONS.NONE,
  );

  const sortedData = useMemo(() => {
    const base = [...data];
    if (sortDirection === SORT_DIRECTIONS.NONE) return base;

    return base.sort((a, b) => {
      const valA = sortBy(a);
      const valB = sortBy(b);

      if (typeof valA === "string" && typeof valB === "string") {
        const compared = valA.localeCompare(valB, undefined, {
          sensitivity: "base",
        });
        return sortDirection === SORT_DIRECTIONS.DESC ? -compared : compared;
      }

      const compared = (valA as number) - (valB as number);
      return sortDirection === SORT_DIRECTIONS.DESC ? -compared : compared;
    });
  }, [data, sortDirection, sortBy]);

  const isHeaderSortable = (header: string) => header === targetHeader;

  const getHeaderSortDirection = (header: string) => {
    if (header === targetHeader && sortDirection !== SORT_DIRECTIONS.NONE) {
      return sortDirection;
    }
    return null;
  };

  const handleHeaderClick = (header: string) => {
    if (header !== targetHeader) return;
    setSortDirection((prev) => {
      if (prev === SORT_DIRECTIONS.NONE) return SORT_DIRECTIONS.ASC;
      if (prev === SORT_DIRECTIONS.ASC) return SORT_DIRECTIONS.DESC;
      return SORT_DIRECTIONS.NONE;
    });
  };

  return {
    sortedData,
    sortDirection,
    setSortDirection,
    isHeaderSortable,
    getHeaderSortDirection,
    handleHeaderClick,
  };
}
