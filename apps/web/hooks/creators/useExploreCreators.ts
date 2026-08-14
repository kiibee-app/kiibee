"use client";

import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { API, useGetAPI } from "@/lib/http/api";
import { axiosClient } from "@/lib/http/axiosClient";
import { resolvePublicMediaUrl } from "@/utils/media";
import type {
  CreatorContentCategoriesResponse,
  CreatorContentCategoryItem,
  CreatorPublicProfileResponse,
  ExploreCreator,
  ExploreCreatorsPaginatedData,
  ExploreCreatorsPagination,
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
import { EXPLORE_PAGE_SIZE } from "@/utils/Constants";

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
    resolvePublicMediaUrl(creator.mobileCoverImageUrl) ??
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

function isPaginatedCreatorsData(
  data: ExploreCreatorsResponse["data"],
): data is ExploreCreatorsPaginatedData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    Array.isArray(data.items) &&
    typeof data.pagination === "object" &&
    data.pagination !== null
  );
}

function extractCreatorsList(
  data: ExploreCreatorsResponse["data"],
): ExploreCreator[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (isPaginatedCreatorsData(data)) {
    return data.items;
  }
  return [];
}

function extractPagination(
  data: ExploreCreatorsResponse["data"],
): ExploreCreatorsPagination | null {
  if (isPaginatedCreatorsData(data)) {
    return data.pagination;
  }
  return null;
}

function mapFilterToSortBy(filter?: string): string | undefined {
  if (filter === SORT_FEATURED) return SORT_FEATURED;
  if (filter === SORT_NEW) return SORT_OPTION_NEWEST;
  if (filter === SORT_POPULAR) return BACKEND_SORT_SUBSCRIBER_COUNT;
  if (filter === SORT_ALL) return BACKEND_SORT_NAME;
  return undefined;
}

const TOP_CREATORS_LIMIT = 6;

export const useExploreCreators = (
  limit?: number,
  search?: string,
  filter?: string,
) => {
  const isAllEndpoint = filter !== undefined;
  const sortBy = mapFilterToSortBy(filter);

  const params = {
    ...(limit !== undefined && { limit }),
    ...(search?.trim() && { search: search.trim() }),
    ...(sortBy !== undefined && { sortBy }),
    ...(isAllEndpoint && { page: 1 }),
  };

  const query = useGetAPI<ExploreCreatorsResponse>(
    isAllEndpoint ? API.creators.all : API.creators.list,
    Object.keys(params).length > 0 ? params : undefined,
  );

  const baseCreators = useMemo(() => {
    if (!query.data?.success) {
      return [];
    }
    return extractCreatorsList(query.data.data).map(normalizeExploreCreator);
  }, [query.data]);

  const creatorIdsMissingCategory = useMemo(
    () =>
      isAllEndpoint
        ? []
        : baseCreators
            .filter((creator) => !creator.category)
            .map((creator) => creator.id),
    [baseCreators, isAllEndpoint],
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

  const pagination = useMemo(
    () => extractPagination(query.data?.data) ?? null,
    [query.data],
  );

  return {
    creators,
    pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
};

type UsePaginatedExploreCreatorsArgs = {
  limit?: number;
  search?: string;
  filter: string;
};

export const usePaginatedExploreCreators = ({
  limit = EXPLORE_PAGE_SIZE,
  search,
  filter,
}: UsePaginatedExploreCreatorsArgs) => {
  const sortBy = mapFilterToSortBy(filter);
  const trimmedSearch = search?.trim() || undefined;

  const query = useInfiniteQuery({
    queryKey: [
      API.creators.all,
      "paginated",
      { limit, search: trimmedSearch, sortBy },
    ],
    queryFn: async ({ pageParam, signal }) => {
      const response = await axiosClient.get<ExploreCreatorsResponse>(
        API.creators.all,
        {
          params: {
            page: pageParam,
            limit,
            ...(trimmedSearch && { search: trimmedSearch }),
            ...(sortBy && { sortBy }),
          },
          signal,
        },
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = extractPagination(lastPage.data);
      if (!pagination) {
        return undefined;
      }
      const hasMore =
        pagination.hasMore ?? pagination.page < pagination.totalPages;
      return hasMore ? pagination.page + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const creators = useMemo(() => {
    if (!query.data?.pages?.length) {
      return [];
    }

    const seen = new Set<string>();
    const merged: ExploreCreator[] = [];

    for (const page of query.data.pages) {
      if (!page.success) continue;
      for (const creator of extractCreatorsList(page.data)) {
        const normalized = normalizeExploreCreator(creator);
        if (seen.has(normalized.id)) continue;
        seen.add(normalized.id);
        merged.push(normalized);
      }
    }

    return merged;
  }, [query.data]);

  const pagination = useMemo(() => {
    const pages = query.data?.pages;
    if (!pages?.length) return null;
    return extractPagination(pages[pages.length - 1]?.data);
  }, [query.data]);

  return {
    creators,
    pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    isError: query.isError,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: query.fetchNextPage,
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
