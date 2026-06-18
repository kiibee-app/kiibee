"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import {
  feedContentToTutorial,
  type FeedContentItem,
} from "@/utils/feedContentToTutorial";
import { getPricingLabels } from "@/utils/contentPricingActions";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";

type PublicCreatorContentResponse = {
  success?: boolean;
  message?: string;
  data?: FeedContentItem[] | null;
};

export function usePublicCreatorContent(creatorId: string | null) {
  const { t } = useTranslation();

  const query = useQuery<PublicCreatorContentResponse>({
    queryKey: [API.content.all, { creatorId }],
    queryFn: async () => {
      const response = await axiosClient.post<PublicCreatorContentResponse>(
        API.content.all,
        { creatorId },
      );
      return response.data;
    },
    enabled: Boolean(creatorId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const tutorials = useMemo((): TutorialVideo[] => {
    const items = query.data?.data;
    if (!Array.isArray(items) || items.length === 0) return [];

    const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
    return items.map((item) =>
      feedContentToTutorial(item, freeLabel, { labels: getPricingLabels(t) }),
    );
  }, [query.data, t]);

  return {
    tutorials,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
