"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { API, useGetAPI } from "@/lib/http/api";
import {
  dedupeFeedContentItems,
  feedContentToTutorial,
  type FeedContentItem,
} from "@/utils/feedContentToTutorial";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";

type RecentContentResponse = {
  success?: boolean;
  message?: string;
  data?: FeedContentItem[];
};

export const useRecentContent = () => {
  const { t } = useTranslation();
  const query = useGetAPI<RecentContentResponse>(API.feed.recent);

  const tutorials = useMemo((): TutorialVideo[] => {
    if (!query.data?.success || !Array.isArray(query.data.data)) {
      return [];
    }

    const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

    return dedupeFeedContentItems(query.data.data).map((item) =>
      feedContentToTutorial(item, freeLabel),
    );
  }, [query.data, t]);

  return {
    tutorials,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
