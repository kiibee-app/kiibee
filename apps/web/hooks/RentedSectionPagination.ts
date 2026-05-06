"use client";

import { useCallback, useState } from "react";
import {
  paginateViewerRentedItems,
  VIEWER_RENTED_PAGE_SIZE,
  type ViewerRentedSectionKey,
} from "@/utils/viewerRented";

const INITIAL_PAGE_START: Record<ViewerRentedSectionKey, number> = {
  collections: 0,
  videos: 0,
  audios: 0,
  pdfs: 0,
};

export function useViewerRentedSectionPagination() {
  const [pageStart, setPageStart] =
    useState<Record<ViewerRentedSectionKey, number>>(INITIAL_PAGE_START);

  const getVisibleItems = useCallback(
    <T>(section: ViewerRentedSectionKey, items: T[]) =>
      paginateViewerRentedItems(
        items,
        pageStart[section],
        VIEWER_RENTED_PAGE_SIZE[section],
      ),
    [pageStart],
  );

  const canSlide = useCallback(
    (section: ViewerRentedSectionKey, totalItems: number) =>
      totalItems > VIEWER_RENTED_PAGE_SIZE[section],
    [],
  );

  const moveNext = useCallback(
    (section: ViewerRentedSectionKey, totalItems: number) => {
      const pageSize = VIEWER_RENTED_PAGE_SIZE[section];
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
