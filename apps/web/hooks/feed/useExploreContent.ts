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

export const EXPLORE_CONTENT_SORT = {
  NEW: "new",
  POPULAR: "popular",
  ALL: "all",
} as const;

export type ExploreContentSort =
  (typeof EXPLORE_CONTENT_SORT)[keyof typeof EXPLORE_CONTENT_SORT];

export type ExploreContentFilters = {
  creatorId?: string[];
  categoryId?: string[];
  contentTypeId?: string[];
  accessType?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: number;
  tags?: string[];
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T | null;
};

type TaxonomyItem = {
  id: string;
  name: string;
};

type UseExploreContentParams = {
  limit?: number;
  search?: string;
  sort?: ExploreContentSort;
  filters?: ExploreContentFilters;
};

type ExploreApiType = "new" | "trending" | "created_for_you";

type ExploreContentSection = "trending" | "latest" | "recent";

export type ExploreTopCreator = Pick<
  ExploreCreator,
  "id" | "name" | "profileImageUrl" | "createdAt"
> & {
  uploadCount: number;
  subscriberCount: number;
};

type ExploreTopCreatorPayload = Omit<
  ExploreTopCreator,
  "uploadCount" | "subscriberCount"
> & {
  uploadCount?: number | string | null;
  subscriberCount?: number | string | null;
};

type ExploreFeedData = {
  trending?: FeedContentItem[];
  latest?: FeedContentItem[];
  recent?: FeedContentItem[];
  topCreators?: ExploreTopCreatorPayload[];
};

type ExploreFeedResponse = ApiResponse<ExploreFeedData>;

const EXPLORE_SORT_TO_API_TYPE: Record<ExploreContentSort, ExploreApiType> = {
  [EXPLORE_CONTENT_SORT.NEW]: "new",
  [EXPLORE_CONTENT_SORT.POPULAR]: "trending",
  [EXPLORE_CONTENT_SORT.ALL]: "created_for_you",
};

const EXPLORE_SORT_TO_SECTION: Record<
  ExploreContentSort,
  ExploreContentSection
> = {
  [EXPLORE_CONTENT_SORT.NEW]: "latest",
  [EXPLORE_CONTENT_SORT.POPULAR]: "trending",
  [EXPLORE_CONTENT_SORT.ALL]: "latest",
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
    ...(hasOptions(filters.tags) ? { tags: filters.tags } : {}),
  };
}

function toSafeNumber(value: number | string | null | undefined): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTopCreator(
  creator: ExploreTopCreatorPayload,
): ExploreTopCreator | null {
  if (!creator.id || !creator.name) {
    return null;
  }

  return {
    id: creator.id,
    name: creator.name,
    profileImageUrl: creator.profileImageUrl ?? null,
    createdAt: creator.createdAt,
    uploadCount: toSafeNumber(creator.uploadCount),
    subscriberCount: toSafeNumber(creator.subscriberCount),
  };
}

function getExploreContentSection(
  sort: ExploreContentSort,
): ExploreContentSection {
  return EXPLORE_SORT_TO_SECTION[sort] ?? "latest";
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

export const useExploreFeed = ({
  limit = 12,
  search,
  sort = EXPLORE_CONTENT_SORT.NEW,
  filters,
}: UseExploreContentParams = {}) => {
  const body = useMemo(() => pruneExploreFilters(filters), [filters]);
  const params = useMemo(
    () => ({
      limit,
      ...(search?.trim() ? { search: search.trim() } : {}),
      type: EXPLORE_SORT_TO_API_TYPE[sort],
    }),
    [limit, search, sort],
  );

  return useQuery<ExploreFeedResponse>({
    queryKey: [API.feed.explore, params, body],
    queryFn: async () => {
      const response = await axiosClient.post<ExploreFeedResponse>(
        API.feed.explore,
        body,
        { params },
      );

      return response.data;
    },
  });
};

function useExploreTutorialSection(
  section: ExploreContentSection,
  params?: UseExploreContentParams,
) {
  const { t } = useTranslation();
  const query = useExploreFeed(params);

  const tutorials = useMemo((): TutorialVideo[] => {
    const items = query.data?.data?.[section];

    if (!query.data?.success || !Array.isArray(items)) {
      return [];
    }

    const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

    return dedupeFeedContentItems(items).map((item) =>
      feedContentToTutorial(item, freeLabel),
    );
  }, [query.data, section, t]);

  return {
    tutorials,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export const useExploreContent = ({
  sort = EXPLORE_CONTENT_SORT.NEW,
  ...params
}: UseExploreContentParams = {}) =>
  useExploreTutorialSection(getExploreContentSection(sort), {
    ...params,
    sort,
  });

export const useExploreTrendingContent = () =>
  useExploreTutorialSection("trending");

export const useExploreRecentContent = () =>
  useExploreTutorialSection("recent");

export const useExploreTopCreators = (limit = 6) => {
  const query = useExploreFeed();

  const creators = useMemo((): ExploreTopCreator[] => {
    const items = query.data?.data?.topCreators;

    if (!query.data?.success || !Array.isArray(items)) {
      return [];
    }

    return items
      .map(normalizeTopCreator)
      .filter((creator): creator is ExploreTopCreator => creator != null)
      .slice(0, limit);
  }, [limit, query.data]);

  return {
    creators,
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
