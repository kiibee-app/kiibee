"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API, useGetAPI } from "@/lib/http/api";
import { axiosClient } from "@/lib/http/axiosClient";
import { resolvePublicMediaUrl } from "@/utils/media";
import type {
  CreatorContentCategoriesResponse,
  CreatorContentCategoryItem,
  CreatorPublicProfileResponse,
  ExploreCreator,
  ExploreCreatorsResponse,
} from "@/types/exploreCreators";
import {
  SORT_ALL,
  SORT_FEATURED,
  SORT_NEW,
  SORT_POPULAR,
  SORT_OPTION_NEWEST,
  type SortValue,
} from "@/utils/sortOptions";

const BACKEND_SORT_SUBSCRIBER_COUNT = "subscriberCount";
const BACKEND_SORT_NAME = "name";

export function formatSubscriberCountK(count: number): number {
  if (count >= 1000) {
    return Math.round(count / 1000);
  }
  return count;
}

export function formatUploadCount(count: number): string {
  if (count >= 1000) {
    const kCount = (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1);
    return `${kCount}K`;
  }
  return String(count);
}

export function sortExploreCreators(
  creators: ExploreCreator[],
  sortBy: SortValue,
): ExploreCreator[] {
  const data = [...creators];

  switch (sortBy) {
    case "a-z":
      return data.sort((a, b) => a.name.localeCompare(b.name));
    case "subscribers":
      return data.sort((a, b) => b.subscriberCount - a.subscriberCount);
    case "newest":
      return data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    default:
      return data;
  }
}

export function getCreatorCardImage(creator: ExploreCreator): string | null {
  return (
    resolvePublicMediaUrl(creator.coverImageUrl) ??
    resolvePublicMediaUrl(creator.profileImageUrl)
  );
}

function normalizeExploreCreator(creator: ExploreCreator): ExploreCreator {
  const [firstContentCategory] = creator.contentCategory ?? [];
  const contentCategory =
    typeof firstContentCategory === "string"
      ? firstContentCategory
      : firstContentCategory?.name;

  return {
    ...creator,
    category:
      creator.category ?? creator.categoryName ?? contentCategory ?? null,
  };
}

function getCreatorCategoryFromContent(
  items?: CreatorContentCategoryItem[] | null,
): Map<string, string> {
  const categories = new Map<string, string>();

  items?.forEach((item) => {
    if (
      !item.creatorId ||
      !item.categoryName ||
      categories.has(item.creatorId)
    ) {
      return;
    }

    categories.set(item.creatorId, item.categoryName);
  });

  return categories;
}

const TOP_CREATORS_LIMIT = 6;

export const useExploreCreators = (
  limit?: number,
  search?: string,
  filter?: string,
) => {
  const isAllEndpoint = filter !== undefined;

  const sortBy =
    filter === SORT_FEATURED
      ? SORT_FEATURED
      : filter === SORT_NEW
        ? SORT_OPTION_NEWEST
        : filter === SORT_POPULAR
          ? BACKEND_SORT_SUBSCRIBER_COUNT
          : filter === SORT_ALL
            ? BACKEND_SORT_NAME
            : undefined;

  const params = {
    ...(limit !== undefined && { limit }),
    ...(search?.trim() && { search: search.trim() }),
    ...(sortBy !== undefined && { sortBy }),
  };

  const query = useGetAPI<ExploreCreatorsResponse>(
    isAllEndpoint ? API.creators.all : API.creators.list,
    Object.keys(params).length > 0 ? params : undefined,
  );

  const baseCreators = useMemo(() => {
    if (!query.data?.success || !Array.isArray(query.data.data)) {
      return [];
    }
    return query.data.data.map(normalizeExploreCreator);
  }, [query.data]);

  const creatorIdsMissingCategory = useMemo(
    () =>
      baseCreators
        .filter((creator) => !creator.category)
        .map((creator) => creator.id),
    [baseCreators],
  );

  const categoryQuery = useQuery<CreatorContentCategoriesResponse>({
    queryKey: [API.content.all, "creatorCategories", creatorIdsMissingCategory],
    queryFn: async ({ signal }) => {
      const response = await axiosClient.post<CreatorContentCategoriesResponse>(
        API.content.all,
        { creatorId: creatorIdsMissingCategory },
        {
          params: { limit: Math.max(creatorIdsMissingCategory.length * 5, 1) },
          signal,
        },
      );

      return response.data;
    },
    enabled: creatorIdsMissingCategory.length > 0,
    refetchOnWindowFocus: false,
  });

  const categoryByCreatorId = useMemo(
    () => getCreatorCategoryFromContent(categoryQuery.data?.data),
    [categoryQuery.data],
  );

  const creators = useMemo(
    () =>
      baseCreators.map((creator) => ({
        ...creator,
        category:
          creator.category ?? categoryByCreatorId.get(creator.id) ?? null,
      })),
    [baseCreators, categoryByCreatorId],
  );

  return {
    creators,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
};

export const useTopCreators = () => useExploreCreators(TOP_CREATORS_LIMIT);

export const useCreatorPublicProfile = (creatorId: string | null) => {
  const query = useGetAPI<CreatorPublicProfileResponse>(
    creatorId ? API.creators.byId(creatorId) : API.creators.list,
    undefined,
    {
      enabled: Boolean(creatorId),
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const creator = useMemo(() => {
    if (!query.data?.success || !query.data.data) {
      return null;
    }
    return query.data.data;
  }, [query.data]);

  return {
    creator,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
