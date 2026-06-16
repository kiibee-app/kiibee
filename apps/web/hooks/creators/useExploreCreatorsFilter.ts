"use client";

import { useMemo, useState } from "react";
import { SORT_OPTION_AZ, EXPLORE_PAGE_SIZE } from "@/utils/Constants";
import {
  SortValue,
  SORT_OPTION_SUBSCRIBERS,
  SORT_OPTION_NEWEST,
  SORT_NEW,
  SORT_POPULAR,
  SORT_FEATURED,
  SORT_ALL,
} from "@/utils/sortOptions";
import { useExploreCreators } from "./useExploreCreators";
import { useDebounce } from "@/hooks/useDebounce";
import { CREATORS } from "@/utils/translationKeys";

export function useExploreCreatorsFilter(filter: string) {
  const initialSortBy = useMemo(() => {
    if (filter === SORT_NEW) return SORT_OPTION_NEWEST as SortValue;
    if (filter === SORT_POPULAR) return SORT_OPTION_SUBSCRIBERS as SortValue;
    return SORT_OPTION_AZ as SortValue;
  }, [filter]);

  const [sortBy, setSortBy] = useState<SortValue>(initialSortBy);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const [limit, setLimit] = useState(EXPLORE_PAGE_SIZE);

  const handleSortChange = (val: SortValue) => {
    setSortBy(val);
    setLimit(EXPLORE_PAGE_SIZE);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setLimit(EXPLORE_PAGE_SIZE);
  };

  const queryFilter = useMemo(() => {
    if (filter === SORT_FEATURED && sortBy === SORT_OPTION_AZ) {
      return SORT_FEATURED;
    }
    if (sortBy === SORT_OPTION_NEWEST) return SORT_NEW;
    if (sortBy === SORT_OPTION_SUBSCRIBERS) return SORT_POPULAR;
    return SORT_ALL;
  }, [filter, sortBy]);

  const { creators, isLoading, isFetching } = useExploreCreators(
    limit,
    debouncedSearchQuery,
    queryFilter,
  );

  const showLoadMoreButton = useMemo(() => {
    return creators.length > 0 && creators.length === limit;
  }, [creators.length, limit]);

  const handleLoadMore = () => {
    setLimit((prev) => prev + EXPLORE_PAGE_SIZE);
  };

  const pageTitle = useMemo(() => {
    const translationKeys: Record<string, string> = {
      [SORT_ALL]: CREATORS.allCreators,
      [SORT_FEATURED]: CREATORS.featured,
      [SORT_NEW]: CREATORS.newCreators,
      [SORT_POPULAR]: CREATORS.popular,
    };
    return translationKeys[filter] || CREATORS.title;
  }, [filter]);

  return {
    filter,
    sortBy,
    setSortBy: handleSortChange,
    searchQuery,
    setSearchQuery: handleSearchChange,
    creators,
    isLoading,
    isFetching,
    pageTitle,
    showLoadMoreButton,
    handleLoadMore,
  };
}
