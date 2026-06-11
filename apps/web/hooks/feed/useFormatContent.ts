"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useExploreContent } from "@/hooks/feed/useExploreContent";
import {
  DEFAULT_SORT,
  SortValue,
  mapSortValueToExploreSort,
} from "@/utils/sortOptions";

export function useFormatContent(formatId: string) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState("");

  const exploreSort = useMemo(() => {
    return mapSortValueToExploreSort(sortBy);
  }, [sortBy]);

  const { tutorials, isLoading, isError } = useExploreContent({
    sort: exploreSort,
    filters: {
      contentTypeId: [formatId],
    },
  });

  const filteredTutorials = useMemo(() => {
    let result = tutorials;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.creator.toLowerCase().includes(q),
      );
    }
    return result;
  }, [tutorials, searchQuery]);

  const formatTitle = useMemo(() => {
    const translationKey = `nav.explore.format.${formatId}`;
    const translated = t(translationKey);
    if (translated === translationKey) {
      return formatId.charAt(0).toUpperCase() + formatId.slice(1);
    }
    return translated;
  }, [formatId, t]);

  return {
    tutorials: filteredTutorials,
    isLoading,
    isError,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    formatTitle,
  };
}
