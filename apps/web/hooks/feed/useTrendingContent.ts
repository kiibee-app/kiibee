"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { API, useGetAPI } from "@/lib/http/api";
import {
  feedContentToTutorial,
  type TrendingContentItem,
} from "@/utils/feedContentToTutorial";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";

const TRENDING_DISPLAY_LIMIT = 4;

function dedupeTrendingItems(
  items: TrendingContentItem[],
): TrendingContentItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

type TrendingContentResponse = {
  success?: boolean;
  message?: string;
  data?: TrendingContentItem[];
};

export const useTrendingContent = () => {
  const { t } = useTranslation();
  const query = useGetAPI<TrendingContentResponse>(API.feed.trending);

  const tutorials = useMemo((): TutorialVideo[] => {
    if (!query.data?.success || !Array.isArray(query.data.data)) {
      return [];
    }

    const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

    return dedupeTrendingItems(query.data.data)
      .slice(0, TRENDING_DISPLAY_LIMIT)
      .map((item) => feedContentToTutorial(item, freeLabel));
  }, [query.data, t]);

  return {
    tutorials,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
