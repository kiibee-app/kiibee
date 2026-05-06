"use client";

import { useCallback, useState } from "react";
import {
  paginateSectionItems,
  RENTED_PAGE_SIZE,
  RENTED_SECTION_KEYS,
  type RentedSectionKey,
} from "@/utils/viewerRented";

const INITIAL_PAGE_START: Record<RentedSectionKey, number> = {
  [RENTED_SECTION_KEYS.COLLECTIONS]: 0,
  [RENTED_SECTION_KEYS.VIDEOS]: 0,
  [RENTED_SECTION_KEYS.AUDIOS]: 0,
  [RENTED_SECTION_KEYS.PDFS]: 0,
};

export function useViewerRentedSectionPagination() {
  const [pageStart, setPageStart] =
    useState<Record<RentedSectionKey, number>>(INITIAL_PAGE_START);

  const getVisibleItems = useCallback(
    <T>(section: RentedSectionKey, items: T[]) =>
      paginateSectionItems(
        items,
        pageStart[section],
        RENTED_PAGE_SIZE[section],
      ),
    [pageStart],
  );

  const canSlide = useCallback(
    (section: RentedSectionKey, totalItems: number) =>
      totalItems > RENTED_PAGE_SIZE[section],
    [],
  );

  const moveNext = useCallback(
    (section: RentedSectionKey, totalItems: number) => {
      const pageSize = RENTED_PAGE_SIZE[section];
      if (totalItems <= pageSize) return;
      setPageStart((prev) => ({
        ...prev,
        [section]: (prev[section] + pageSize) % totalItems,
      }));
    },
    [],
  );

  return { getVisibleItems, canSlide, moveNext };
}
