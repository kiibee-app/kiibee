"use client";

import { useState } from "react";
import { EXPLORE_PAGE_SIZE } from "@/utils/Constants";
import {
  getExploreCreatorInitialSort,
  getExploreCreatorTitleKey,
  mapCreatorSortToExploreFilter,
  type ExploreCreatorFilter,
  type SortValue,
} from "@/utils/sortOptions";
import { useExploreCreators } from "./useExploreCreators";
import { useDebounce } from "@/hooks/useDebounce";

export function useExploreCreatorsFilter(filter: ExploreCreatorFilter) {
  const [sortBy, setSortBy] = useState<SortValue>(() =>
    getExploreCreatorInitialSort(filter),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(EXPLORE_PAGE_SIZE);
  const debouncedSearchQuery = useDebounce(searchQuery);

  const resetLimit = () => {
    setLimit(EXPLORE_PAGE_SIZE);
  };

  const handleSortChange = (value: SortValue) => {
    setSortBy(value);
    resetLimit();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetLimit();
  };

  const { creators, isLoading, isFetching } = useExploreCreators(
    limit,
    debouncedSearchQuery,
    mapCreatorSortToExploreFilter(filter, sortBy),
  );

  const handleLoadMore = () => {
    setLimit((prev) => prev + EXPLORE_PAGE_SIZE);
  };

  return {
    filter,
    sortBy,
    setSortBy: handleSortChange,
    searchQuery,
    setSearchQuery: handleSearchChange,
    creators,
    isLoading,
    isFetching,
    pageTitle: getExploreCreatorTitleKey(filter),
    showLoadMoreButton: creators.length > 0 && creators.length === limit,
    handleLoadMore,
  };
}
