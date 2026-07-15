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
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";
import { resolveContentThumbnailCandidates } from "@/utils/media";
import { getPricingLabels } from "@/utils/contentPricingActions";

type ApiResponse<T> = {
  success?: boolean;
  data?: T | null;
};

type PublicCollectionPayload = {
  collectionId: string;
  name: string;
  description?: string | null;
  items: FeedContentItem[];
};

export type PublicCollectionResult = {
  collectionId: string;
  name: string;
  description?: string | null;
  creatorId?: string;
  creatorName?: string;
  heroImage?: string;
  heroImageFallback?: string;
  videos: TutorialVideo[];
};

type Options = {
  enabled?: boolean;
};

export function usePublicCollectionContent(
  collectionId?: string | null,
  options?: Options,
) {
  const { t } = useTranslation();
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

  const query = useQuery<PublicCollectionResult | null>({
    queryKey: ["public-collection-content", collectionId],
    enabled: Boolean(collectionId) && (options?.enabled ?? true),
    queryFn: async () => {
      if (!collectionId) return null;

      const response = await axiosClient.get<
        ApiResponse<PublicCollectionPayload | null>
      >(API.content.publicCollection(collectionId));

      const payload = response.data?.data;
      if (!response.data?.success || !payload) {
        return null;
      }

      const items = payload.items || [];
      const primaryItem = items[0];
      const heroImages = resolveContentThumbnailCandidates(
        primaryItem?.thumbnailUrl,
        primaryItem?.thumbnailLandscapeUrl,
        { preferLandscape: true },
      );

      return {
        collectionId: payload.collectionId,
        name: payload.name,
        description: payload.description,
        creatorId: primaryItem?.creatorId,
        creatorName: primaryItem?.creatorName ?? undefined,
        heroImage: heroImages[0],
        heroImageFallback: heroImages[1],
        videos: items.map((item) =>
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
