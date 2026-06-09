import { useMemo, useState } from "react";
import { SORT_DIRECTIONS, type SortDirectionWithNone } from "@/utils/ui";
import { isString, SENSITIVITY_BASE } from "@/utils/Constants";

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
    if (sortDirection === SORT_DIRECTIONS.NONE) return [...data];

    return [...data].sort((firstItem, secondItem) => {
      const firstValue = sortBy(firstItem);
      const secondValue = sortBy(secondItem);

      const compared =
        isString(firstValue) && isString(secondValue)
          ? firstValue.localeCompare(secondValue, undefined, {
              sensitivity: SENSITIVITY_BASE,
            })
          : (firstValue as number) - (secondValue as number);

      return sortDirection === SORT_DIRECTIONS.DESC ? -compared : compared;
    });
  }, [data, sortDirection, sortBy]);

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
    isHeaderSortable: (header: string) => header === targetHeader,
    getHeaderSortDirection: (header: string) =>
      header === targetHeader && sortDirection !== SORT_DIRECTIONS.NONE
        ? sortDirection
        : null,
    handleHeaderClick,
  };
}
