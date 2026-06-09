import { useState } from "react";
import { SORT_DIRECTIONS, type SortDirectionWithNone } from "@/utils/ui";
import { isString, SENSITIVITY_BASE } from "@/utils/Constants";

interface UseTableSortConfig<T> {
  sortableHeader: string;
  sortBy: (item: T) => string | number;
}

function getNextSortDirection(
  direction: SortDirectionWithNone,
): SortDirectionWithNone {
  switch (direction) {
    case SORT_DIRECTIONS.NONE:
      return SORT_DIRECTIONS.ASC;
    case SORT_DIRECTIONS.ASC:
      return SORT_DIRECTIONS.DESC;
    default:
      return SORT_DIRECTIONS.NONE;
  }
}

function compareValues(
  firstValue: string | number,
  secondValue: string | number,
) {
  if (isString(firstValue) && isString(secondValue)) {
    return firstValue.localeCompare(secondValue, undefined, {
      sensitivity: SENSITIVITY_BASE,
    });
  }

  return Number(firstValue) - Number(secondValue);
}

export function useTableSort<T>(
  data: T[],
  { sortableHeader, sortBy }: UseTableSortConfig<T>,
) {
  const [sortDirection, setSortDirection] = useState<SortDirectionWithNone>(
    SORT_DIRECTIONS.NONE,
  );

  const sortedData = (() => {
    if (sortDirection === SORT_DIRECTIONS.NONE) return [...data];

    return [...data].sort((firstItem, secondItem) => {
      const firstValue = sortBy(firstItem);
      const secondValue = sortBy(secondItem);
      const compared = compareValues(firstValue, secondValue);

      return sortDirection === SORT_DIRECTIONS.DESC ? -compared : compared;
    });
  })();

  const toggleSort = (header: string) => {
    if (header !== sortableHeader) return;
    setSortDirection(getNextSortDirection);
  };

  return {
    sortedData,
    sortDirection,
    resetSort: () => setSortDirection(SORT_DIRECTIONS.NONE),
    isHeaderSortable: (header: string) => header === sortableHeader,
    getHeaderSortDirection: (header: string) =>
      header === sortableHeader && sortDirection !== SORT_DIRECTIONS.NONE
        ? sortDirection
        : null,
    toggleSort,
  };
}
