"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_SORT,
  getExploreCreatorInitialSort,
  getExploreCreatorTitleKey,
  SORT_FEATURED,
  SORT_OPTION_AZ,
  SORT_OPTION_NEWEST,
  SORT_OPTION_POPULAR,
  SORT_OPTION_SUBSCRIBERS,
  SORT_POPULAR,
  type ExploreCreatorFilter,
  type SortValue,
} from "@/utils/sortOptions";
import { usePaginatedExploreCreators } from "./useExploreCreators";
import { useDebounce } from "@/hooks/useDebounce";
import { EXPLORE_INITIAL_PAGE_SIZE } from "@/utils/Constants";

export function useExploreCreatorsFilter(filter: ExploreCreatorFilter) {
  const [sortBy, setSortBy] = useState<SortValue>(() =>
    getExploreCreatorInitialSort(filter),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);

  const handleSortChange = useCallback((value: SortValue) => {
    setSortBy(value);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const backendSortBy = useMemo(() => {
    if (filter === SORT_FEATURED && sortBy === DEFAULT_SORT) {
      return SORT_FEATURED;
    }
    if (sortBy === SORT_OPTION_POPULAR) return SORT_POPULAR;
    if (sortBy === SORT_OPTION_SUBSCRIBERS) return SORT_OPTION_SUBSCRIBERS;
    if (sortBy === SORT_OPTION_NEWEST) return SORT_OPTION_NEWEST;
    if (sortBy === SORT_OPTION_AZ) return "name";
    return undefined;
  }, [filter, sortBy]);

  const {
    creators,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePaginatedExploreCreators({
    limit: EXPLORE_INITIAL_PAGE_SIZE,
    search: debouncedSearchQuery,
    sortBy: backendSortBy,
  });

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return {
    filter,
    sortBy,
    setSortBy: handleSortChange,
    searchQuery,
    setSearchQuery: handleSearchChange,
    creators,
    isLoading,
    isFetching,
    isFetchingNextPage,
    pageTitle: getExploreCreatorTitleKey(filter),
    showLoadMoreButton: creators.length > 0 && hasNextPage,
    handleLoadMore,
  };
}
