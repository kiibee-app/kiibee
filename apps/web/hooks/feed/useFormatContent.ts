"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useExploreContent } from "@/hooks/feed/useExploreContent";
import {
  DEFAULT_SORT,
  SortValue,
  mapSortValueToExploreSort,
} from "@/utils/sortOptions";
import { EXPLORE_PAGE_SIZE } from "@/utils/Constants";

export function useFormatContent(formatId: string) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(EXPLORE_PAGE_SIZE);

  const exploreSort = useMemo(() => {
    return mapSortValueToExploreSort(sortBy);
  }, [sortBy]);

  const { tutorials, isLoading, isError } = useExploreContent({
    sort: exploreSort,
    limit,
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

  const showLoadMoreButton = tutorials.length >= limit;

  const handleLoadMore = () => {
    setLimit((prev) => prev + EXPLORE_PAGE_SIZE);
  };

  return {
    tutorials: filteredTutorials,
    isLoading,
    isError,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    formatTitle,
    showLoadMoreButton,
    handleLoadMore,
  };
}
