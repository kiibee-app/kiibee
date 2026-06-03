"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { axiosClient } from "@/lib/http/axiosClient";
import { API, useGetAPI } from "@/lib/http/api";
import type { ExploreCreator } from "@/hooks/creators/useExploreCreators";
import {
  dedupeFeedContentItems,
  feedContentToTutorial,
  type FeedContentItem,
} from "@/utils/feedContentToTutorial";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";
import type { OptionItem } from "@/types/exportCreators";

export const ALL_FILTER_OPTION_KEY = "all";

export const EXPLORE_FEED_TYPE = {
  NEW: "new",
  TRENDING: "trending",
  CREATED_FOR_YOU: "created_for_you",
} as const;

export type ExploreFeedType =
  (typeof EXPLORE_FEED_TYPE)[keyof typeof EXPLORE_FEED_TYPE];

export type ExploreContentFilters = {
  creatorId?: string[];
  categoryId?: string[];
  contentTypeId?: string[];
  accessType?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: number;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T | null;
};

type ExploreContentData = {
  trending?: FeedContentItem[];
  latest?: FeedContentItem[];
  recent?: FeedContentItem[];
  topCreators?: unknown[];
};

type TaxonomyItem = {
  id: string;
  name: string;
};

type UseExploreContentParams = {
  limit?: number;
  search?: string;
  type?: ExploreFeedType;
  filters?: ExploreContentFilters;
};

function hasOptions(values?: string[]) {
  return Array.isArray(values) && values.length > 0;
}

export function withoutAllFilterOption(values: string[]) {
  return values.filter((value) => value !== ALL_FILTER_OPTION_KEY);
}

function pruneExploreFilters(
  filters: ExploreContentFilters = {},
): ExploreContentFilters {
  return {
    ...(hasOptions(filters.creatorId) ? { creatorId: filters.creatorId } : {}),
    ...(hasOptions(filters.categoryId)
      ? { categoryId: filters.categoryId }
      : {}),
    ...(hasOptions(filters.contentTypeId)
      ? { contentTypeId: filters.contentTypeId }
      : {}),
    ...(filters.accessType ? { accessType: filters.accessType } : {}),
    ...(filters.minPrice ? { minPrice: filters.minPrice } : {}),
    ...(filters.maxPrice ? { maxPrice: filters.maxPrice } : {}),
    ...(filters.rating != null ? { rating: filters.rating } : {}),
  };
}

function toOptionItems(items?: TaxonomyItem[] | null): OptionItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => item.id && item.name)
    .map((item) => ({
      key: item.id,
      label: item.name,
    }));
}

export const useExploreContent = ({
  limit = 12,
  search,
  type = EXPLORE_FEED_TYPE.NEW,
  filters,
}: UseExploreContentParams = {}) => {
  const { t } = useTranslation();
  const body = useMemo(() => pruneExploreFilters(filters), [filters]);
  const params = useMemo(
    () => ({
      limit,
      ...(search?.trim() ? { search: search.trim() } : {}),
      type,
    }),
    [limit, search, type],
  );

  const query = useQuery<ApiResponse<ExploreContentData>>({
    queryKey: [API.feed.explore, params, body],
    queryFn: async () => {
      const response = await axiosClient.post<ApiResponse<ExploreContentData>>(
        API.feed.explore,
        body,
        { params },
      );

      return response.data;
    },
  });

  const tutorials = useMemo((): TutorialVideo[] => {
    const latest = query.data?.data?.latest;

    if (!query.data?.success || !Array.isArray(latest)) {
      return [];
    }

    const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

    return dedupeFeedContentItems(latest).map((item) =>
      feedContentToTutorial(item, freeLabel),
    );
  }, [query.data, t]);

  return {
    tutorials,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export const useExploreFilterOptions = () => {
  const { t } = useTranslation();
  const creatorsQuery = useGetAPI<ApiResponse<ExploreCreator[]>>(
    API.creators.list,
  );
  const categoriesQuery = useGetAPI<ApiResponse<TaxonomyItem[]>>(
    API.content.categories,
  );
  const contentTypesQuery = useGetAPI<ApiResponse<TaxonomyItem[]>>(
    API.content.types,
  );

  const creatorLabels = useMemo(
    (): OptionItem[] =>
      Array.isArray(creatorsQuery.data?.data)
        ? creatorsQuery.data.data.map((creator) => ({
            key: creator.id,
            label: creator.name,
          }))
        : [],
    [creatorsQuery.data],
  );

  const categoryLabels = useMemo(
    (): OptionItem[] => [
      {
        key: ALL_FILTER_OPTION_KEY,
        label: t("creators.filters.options.categories.all"),
      },
      ...toOptionItems(categoriesQuery.data?.data),
    ],
    [categoriesQuery.data, t],
  );

  const formatLabels = useMemo(
    (): OptionItem[] => [
      {
        key: ALL_FILTER_OPTION_KEY,
        label: t("creators.filters.options.formats.all"),
      },
      ...toOptionItems(contentTypesQuery.data?.data),
    ],
    [contentTypesQuery.data, t],
  );

  const categoryOptions = useMemo(
    () => categoryLabels.map((item) => item.key),
    [categoryLabels],
  );
  const formatOptions = useMemo(
    () => formatLabels.map((item) => item.key),
    [formatLabels],
  );

  return {
    creatorLabels,
    categoryLabels,
    formatLabels,
    categoryOptions,
    formatOptions,
    isLoading:
      creatorsQuery.isLoading ||
      categoriesQuery.isLoading ||
      contentTypesQuery.isLoading,
    isError:
      creatorsQuery.isError ||
      categoriesQuery.isError ||
      contentTypesQuery.isError,
  };
};
