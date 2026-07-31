"use client";

import { useCallback, useState } from "react";
import {
  getExploreCreatorInitialSort,
  getExploreCreatorTitleKey,
  mapCreatorSortToExploreFilter,
  type ExploreCreatorFilter,
  type SortValue,
} from "@/utils/sortOptions";
import { usePaginatedExploreCreators } from "./useExploreCreators";
import { useDebounce } from "@/hooks/useDebounce";
import { EXPLORE_PAGE_SIZE } from "@/utils/Constants";

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

  const {
    creators,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePaginatedExploreCreators({
    limit: EXPLORE_PAGE_SIZE,
    search: debouncedSearchQuery,
    filter: mapCreatorSortToExploreFilter(filter, sortBy),
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
