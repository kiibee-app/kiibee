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
import {
  getPricingLabels,
  isPaidCollection,
} from "@/utils/contentPricingActions";

type ApiResponse<T> = {
  success?: boolean;
  data?: T | null;
};

type PublicCollectionPayload = {
  collectionId: string;
  name: string;
  description?: string | null;
  accessType?: string | null;
  buyPrice?: number | string | null;
  rentPrice?: number | string | null;
  rentDuration?: string | null;
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
  accessType?: string | null;
  buyPrice?: number | string | null;
  rentPrice?: number | string | null;
  rentDuration?: string | null;
  isPaid?: boolean;
  videos: TutorialVideo[];
};

type Options = {
  enabled?: boolean;
};

export function usePublicCollectionContent(
  collectionId?: string | null,
  viewerId?: string | null,
  options?: Options,
) {
  const { t } = useTranslation();
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

  const query = useQuery<PublicCollectionResult | null>({
    queryKey: ["public-collection-content", collectionId, viewerId],
    enabled: Boolean(collectionId) && (options?.enabled ?? true),
    queryFn: async () => {
      if (!collectionId) return null;

      const response = await axiosClient.get<
        ApiResponse<PublicCollectionPayload | null>
      >(API.content.publicCollection(collectionId, viewerId ?? undefined));

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

      const isPaid = isPaidCollection({
        accessType: payload.accessType,
        buyPrice: payload.buyPrice,
        rentPrice: payload.rentPrice,
        rentDuration: payload.rentDuration,
      });

      const partOfCollectionLabel = t("pricingLabels.partOfCollection");

      return {
        collectionId: payload.collectionId,
        name: payload.name,
        description: payload.description,
        creatorId: primaryItem?.creatorId,
        creatorName: primaryItem?.creatorName ?? undefined,
        heroImage: heroImages[0],
        heroImageFallback: heroImages[1],
        accessType: payload.accessType,
        buyPrice: payload.buyPrice,
        rentPrice: payload.rentPrice,
        rentDuration: payload.rentDuration,
        isPaid,
        videos: items.map((item) =>
          feedContentToTutorial(item, freeLabel, {
            inCollection: true,
            collectionId: payload.collectionId,
            isPaidCollection: isPaid,
            collectionAccessType: payload.accessType,
            partOfCollectionLabel,
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
