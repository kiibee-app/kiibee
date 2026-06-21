"use client";

import { useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";
import { resolvePublicMediaUrl } from "@/utils/media";
import type { CreatorLayoutKey } from "@/utils/creatorChannel";
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

export type ExploreCreator = {
  id: string;
  name: string;
  slug: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  category: string | null;
  uploadCount: number;
  subscriberCount: number;
  createdAt: string;
  contentDescription?: string | null;
  exampleWorkLink?: string | null;
  accessType?: string | null;
  layout?: CreatorLayoutKey | null;
};

type ExploreCreatorsResponse = {
  success?: boolean;
  message?: string;
  data?: ExploreCreator[];
};

export type CreatorPublicProfileResponse = {
  success?: boolean;
  message?: string;
  data?: ExploreCreator;
};

export function formatSubscriberCountK(count: number): number {
  if (count >= 1000) {
    return Math.round(count / 1000);
  }
  return count;
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

  const creators = useMemo(() => {
    if (!query.data?.success || !Array.isArray(query.data.data)) {
      return [];
    }
    return query.data.data;
  }, [query.data]);

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
