"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { useExploreFilterOptions } from "@/hooks/feed/useExploreContent";
import { useCreatorFilters } from "@/hooks/useCreatorFilters";
import {
  feedContentToTutorial,
  type FeedContentItem,
} from "@/utils/feedContentToTutorial";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T | null;
};

type TaxonomyItem = {
  id: string;
  name: string;
};

export function useCategoryContent(categoryName: string) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOption, setSortOption] = useState<string>("new");
  const [limit, setLimit] = useState(24);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 400);
    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const { data: categoriesData } = useQuery<ApiResponse<TaxonomyItem[]>>({
    queryKey: [API.content.categories],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<TaxonomyItem[]>>(
        API.content.categories,
      );
      return response.data;
    },
  });

  const categoryDisplayName = useMemo(() => {
    const categoriesList = categoriesData?.data || [];
    const matched = categoriesList.find(
      (c) => c.id.toLowerCase() === categoryName.toLowerCase(),
    );
    if (matched) return matched.name;
    return categoryName
      ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
      : "";
  }, [categoriesData, categoryName]);

  const {
    creatorLabels: allCreatorLabels,
    formatLabels,
    categoryOptions,
    formatOptions,
  } = useExploreFilterOptions();

  const urlFormat = searchParams.get("format");
  const initialSelectedOptions = useMemo(
    () => ({
      formats: urlFormat ? [urlFormat] : [],
      categories: [categoryName],
    }),
    [urlFormat, categoryName],
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
      "categoryContent",
      categoryName,
      sortOption,
      debouncedSearch,
      filterStates.selectedOptions.creators,
      filterStates.selectedOptions.formats,
      filterStates.priceRange,
      filterStates.selectedRating,
      limit,
    ],
    queryFn: async () => {
      const body = {
        categoryId: [categoryName],
        creatorId:
          filterStates.selectedOptions.creators.length > 0
            ? filterStates.selectedOptions.creators
            : undefined,
        contentTypeId:
          filterStates.selectedOptions.formats.length > 0
            ? filterStates.selectedOptions.formats
            : undefined,
        minPrice: filterStates.priceRange.min || undefined,
        maxPrice: filterStates.priceRange.max || undefined,
        rating: filterStates.selectedRating ?? undefined,
      };

      const queryParams = {
        limit,
        search: debouncedSearch || undefined,
        sort: sortOption === "a-z" ? "all" : sortOption,
      };

      const response = await axiosClient.post<ApiResponse<FeedContentItem[]>>(
        API.content.all,
        body,
        { params: queryParams },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    enabled: !!categoryName,
  });

  const tutorials = useMemo((): TutorialVideo[] => {
    const rawItems = contentData?.data;
    if (!Array.isArray(rawItems)) return [];

    const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
    const parsed = rawItems.map((item) =>
      feedContentToTutorial(item, freeLabel),
    );
    if (sortOption === "a-z") {
      return [...parsed].sort((a, b) => a.title.localeCompare(b.title));
    }

    return parsed;
  }, [contentData, sortOption, t]);

  const handleLoadMore = () => {
    setLimit((prev) => prev + 24);
  };

  const showLoadMoreButton = tutorials.length >= limit;

  return {
    categoryDisplayName,
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
    formatLabels,
    ...filterStates,
  };
}
