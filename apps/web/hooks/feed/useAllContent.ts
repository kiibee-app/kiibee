"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useExploreFilterOptions } from "@/hooks/feed/useExploreContent";
import { useCreatorFilters } from "@/hooks/useCreatorFilters";
import {
  feedContentToTutorial,
  type FeedContentItem,
} from "@/utils/feedContentToTutorial";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";
import { useDebounce } from "@/hooks/useDebounce";
import {
  EXPLORE_PAGE_SIZE,
  SORT_OPTION_AZ,
  SORT_OPTION_NEW,
  SORT_OPTION_POPULAR,
  ACCESS_TYPE_FREE,
  EXPLORE_SUBSECTION_EVERYTHING,
  QUERY_KEY_FORMAT,
  QUERY_KEYS,
} from "@/utils/Constants";
import { fetchAllContent, type ApiResponse } from "./useAllContentHelper";

export function useAllContent(allContentId: string) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue);

  const initialSortOption = useMemo(() => {
    if (allContentId === SORT_OPTION_POPULAR) return SORT_OPTION_POPULAR;
    if (allContentId === ACCESS_TYPE_FREE) return ACCESS_TYPE_FREE;
    return SORT_OPTION_NEW;
  }, [allContentId]);

  const [sortOption, setSortOption] = useState<string>(initialSortOption);
  const [limit, setLimit] = useState(EXPLORE_PAGE_SIZE);
  const [prevAllContentId, setPrevAllContentId] = useState(allContentId);

  if (allContentId !== prevAllContentId) {
    setPrevAllContentId(allContentId);
    setSortOption(initialSortOption);
    setLimit(EXPLORE_PAGE_SIZE);
  }

  const {
    creatorLabels: allCreatorLabels,
    categoryLabels,
    formatLabels,
    categoryOptions,
    formatOptions,
  } = useExploreFilterOptions();

  const urlFormat = searchParams.get(QUERY_KEY_FORMAT);
  const initialSelectedOptions = useMemo(
    () => ({
      formats: urlFormat ? [urlFormat] : [],
    }),
    [urlFormat],
  );

  const filterStates = useCreatorFilters({
    categoryOptions,
    formatOptions,
    initialSelectedOptions,
  });

  const {
    data: contentData,
    isLoading,
    isFetching,
  } = useQuery<ApiResponse<FeedContentItem[]>>({
    queryKey: [
      QUERY_KEYS.ALL_CONTENT_SUB,
      allContentId,
      sortOption,
      debouncedSearch,
      filterStates.selectedOptions.creators,
      filterStates.selectedOptions.categories,
      filterStates.selectedOptions.formats,
      filterStates.priceRange,
      filterStates.selectedRating,
      limit,
    ],
    queryFn: () =>
      fetchAllContent({
        allContentId,
        sortOption,
        debouncedSearch,
        categories: filterStates.selectedOptions.categories,
        creators: filterStates.selectedOptions.creators,
        formats: filterStates.selectedOptions.formats,
        priceRange: filterStates.priceRange,
        selectedRating: filterStates.selectedRating,
        limit,
      }),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  const tutorials = useMemo((): TutorialVideo[] => {
    const rawItems = contentData?.data;
    if (!Array.isArray(rawItems)) return [];

    const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
    const parsed = rawItems.map((item) =>
      feedContentToTutorial(item, freeLabel),
    );
    if (sortOption === SORT_OPTION_AZ) {
      return [...parsed].sort((a, b) => a.title.localeCompare(b.title));
    }

    return parsed;
  }, [contentData, sortOption, t]);

  const handleLoadMore = () => {
    setLimit((prev) => prev + EXPLORE_PAGE_SIZE);
  };

  const showLoadMoreButton = tutorials.length >= limit;

  const title = useMemo(() => {
    const validKeys: Record<string, string> = {
      [EXPLORE_SUBSECTION_EVERYTHING]: "nav.explore.everything",
      [SORT_OPTION_NEW]: "nav.explore.newReleases",
      [SORT_OPTION_POPULAR]: "nav.explore.popular",
      [ACCESS_TYPE_FREE]: "nav.explore.freeContent",
    };
    const key = validKeys[allContentId];
    return key ? t(key) : allContentId;
  }, [allContentId, t]);

  return {
    title,
    tutorials,
    isLoading,
    isFetching,
    searchValue,
    setSearchValue,
    sortOption,
    setSortOption,
    showLoadMoreButton,
    handleLoadMore,
    allCreatorLabels,
    categoryLabels,
    formatLabels,
    ...filterStates,
  };
}
