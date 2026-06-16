"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SORT_OPTION_AZ, isString } from "@/utils/Constants";
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

export function useExploreCreatorsFilter() {
  const { t } = useTranslation();
  const params = useParams();

  const rawFilter = params?.filter;
  const filter = isString(rawFilter) ? rawFilter : SORT_ALL;

  const initialSortBy = useMemo(() => {
    if (filter === SORT_NEW) return SORT_OPTION_NEWEST as SortValue;
    if (filter === SORT_POPULAR) return SORT_OPTION_SUBSCRIBERS as SortValue;
    return SORT_OPTION_AZ as SortValue;
  }, [filter]);

  const [sortBy, setSortBy] = useState<SortValue>(initialSortBy);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);

  useEffect(() => {
    setSortBy(initialSortBy);
  }, [initialSortBy]);

  const queryFilter = useMemo(() => {
    if (filter === SORT_FEATURED && sortBy === SORT_OPTION_AZ) {
      return SORT_FEATURED;
    }
    if (sortBy === SORT_OPTION_NEWEST) return SORT_NEW;
    if (sortBy === SORT_OPTION_SUBSCRIBERS) return SORT_POPULAR;
    return SORT_ALL;
  }, [filter, sortBy]);

  const { creators, isLoading, isFetching } = useExploreCreators(
    undefined,
    debouncedSearchQuery,
    queryFilter,
  );

  const pageTitle = useMemo(() => {
    const translationKeys: Record<string, string> = {
      [SORT_ALL]: CREATORS.allCreators,
      [SORT_FEATURED]: CREATORS.featured,
      [SORT_NEW]: CREATORS.newCreators,
      [SORT_POPULAR]: CREATORS.popular,
    };
    return t(translationKeys[filter] || CREATORS.title);
  }, [filter, t]);

  return {
    filter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    creators,
    isLoading,
    isFetching,
    pageTitle,
  };
}
