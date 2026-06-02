"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { API, useGetAPI } from "@/lib/http/api";
import {
  dedupeFeedContentItems,
  FEED_CONTENT_PAGE_SIZE,
  feedContentToTutorial,
  type FeedContentItem,
} from "@/utils/feedContentToTutorial";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";

type TrendingContentResponse = {
  success?: boolean;
  message?: string;
  data?: FeedContentItem[];
};

export const useTrendingContent = () => {
  const { t } = useTranslation();
  const query = useGetAPI<TrendingContentResponse>(
    API.feed.trending,
    undefined,
    {
      refetchOnMount: "always",
    },
  );

  const tutorials = useMemo((): TutorialVideo[] => {
    const items = Array.isArray(query.data?.data)
      ? query.data.data
      : Array.isArray(query.data)
        ? query.data
        : [];
    if (items.length === 0) return [];

    const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

    return dedupeFeedContentItems(items)
      .slice(0, FEED_CONTENT_PAGE_SIZE)
      .map((item) => feedContentToTutorial(item, freeLabel));
  }, [query.data, t]);

  return {
    tutorials,
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError,
  };
};
