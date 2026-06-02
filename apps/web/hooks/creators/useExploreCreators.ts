"use client";

import { useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";
import type { SortValue } from "@/utils/sortOptions";

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
  return creator.coverImageUrl ?? creator.profileImageUrl;
}

const TOP_CREATORS_LIMIT = 6;

export const useExploreCreators = (limit?: number) => {
  const params = limit != null ? { limit } : undefined;
  const query = useGetAPI<ExploreCreatorsResponse>(API.creators.list, params, {
    refetchOnMount: "always",
  });

  const creators = useMemo(() => {
    if (Array.isArray(query.data?.data)) return query.data.data;
    if (Array.isArray(query.data)) return query.data;
    return [];
  }, [query.data]);

  return {
    creators,
    isLoading: query.isLoading || query.isFetching,
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
    if (query.data?.data) return query.data.data;
    if (query.data && "id" in query.data && "name" in query.data) {
      return query.data as ExploreCreator;
    }
    return null;
  }, [query.data]);

  return {
    creator,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
