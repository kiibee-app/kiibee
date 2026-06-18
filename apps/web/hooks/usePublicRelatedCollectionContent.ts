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

type ApiResponse<T> = {
  success?: boolean;
  data?: T | null;
};

type RelatedCollectionPayload = {
  collectionId: string;
  items: FeedContentItem[];
};

export type PublicRelatedCollectionResult = {
  collectionId: string;
  videos: TutorialVideo[];
};

type Options = {
  enabled?: boolean;
};

export function usePublicRelatedCollectionContent(
  contentId?: string | null,
  options?: Options,
) {
  const { t } = useTranslation();
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

  const query = useQuery<PublicRelatedCollectionResult | null>({
    queryKey: ["public-related-collection-content", contentId],
    enabled: Boolean(contentId) && (options?.enabled ?? true),
    queryFn: async () => {
      if (!contentId) return null;

      const response = await axiosClient.get<
        ApiResponse<RelatedCollectionPayload | null>
      >(API.content.relatedCollection(contentId));

      const payload = response.data?.data;
      if (!response.data?.success || !payload?.items?.length) {
        return null;
      }

      return {
        collectionId: payload.collectionId,
        videos: payload.items.map((item) =>
          feedContentToTutorial(item, freeLabel, {
            inCollection: true,
            labels: getPricingLabels(t),
          }),
        ),
      };
    },
  });

  return useMemo(
    () => ({
      data: query.data ?? null,
      isLoading: query.isLoading,
      isError: query.isError,
    }),
    [query.data, query.isError, query.isLoading],
  );
}
