"use client";

import { useCallback, useState } from "react";
import {
  paginateSectionItems,
  RENTED_PAGE_SIZE,
  type RentedSectionKey,
} from "@/utils/viewerRented";

const INITIAL_PAGE_START: Record<RentedSectionKey, number> = {
  collections: 0,
  videos: 0,
  audios: 0,
  pdfs: 0,
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
