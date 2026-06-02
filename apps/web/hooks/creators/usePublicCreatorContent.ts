"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import {
  dedupeFeedContentItems,
  feedContentToTutorial,
  type FeedContentItem,
} from "@/utils/feedContentToTutorial";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";

type ExploreFeedResponse = {
  data?: { latest?: FeedContentItem[] };
};

type FeedListResponse = {
  data?: FeedContentItem[];
};

function parseFeedItems(
  response: ExploreFeedResponse | FeedListResponse,
): FeedContentItem[] {
  if (Array.isArray((response as FeedListResponse).data)) {
    return (response as FeedListResponse).data!;
  }
  const latest = (response as ExploreFeedResponse).data?.latest;
  return Array.isArray(latest) ? latest : [];
}

export function usePublicCreatorContent(creatorId: string | null) {
  const { t } = useTranslation();

  const query = useQuery({
    queryKey: ["public-creator-content", creatorId],
    enabled: Boolean(creatorId),
    queryFn: async () => {
      const exploreRes = await axiosClient.post<ExploreFeedResponse>(
        API.feed.explore,
        { creatorId: [creatorId] },
        { params: { limit: 50 } },
      );

      const exploreItems = parseFeedItems(exploreRes.data).filter(
        (item) => item.creatorId === creatorId,
      );
      if (exploreItems.length > 0) return exploreItems;

      const [recentRes, trendingRes] = await Promise.all([
        axiosClient.get<FeedListResponse>(API.feed.recent),
        axiosClient.get<FeedListResponse>(API.feed.trending),
      ]);

      return [
        ...parseFeedItems(recentRes.data),
        ...parseFeedItems(trendingRes.data),
      ].filter((item) => item.creatorId === creatorId);
    },
    retry: false,
  });

  const tutorials = useMemo((): TutorialVideo[] => {
    if (!Array.isArray(query.data) || query.data.length === 0) return [];

    const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
    return dedupeFeedContentItems(query.data).map((item) =>
      feedContentToTutorial(item, freeLabel),
    );
  }, [query.data, t]);

  return {
    tutorials,
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError,
  };
}
