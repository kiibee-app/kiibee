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
import {
  getPricingLabels,
  isPaidCollection,
} from "@/utils/contentPricingActions";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialVideo } from "@/utils/types";

type ApiResponse<T> = {
  success?: boolean;
  data?: T | null;
};

type RelatedCollectionPayload = {
  collectionId: string;
  accessType?: string | null;
  buyPrice?: number | string | null;
  rentPrice?: number | string | null;
  rentDuration?: string | null;
  items: FeedContentItem[];
};

export type PublicRelatedCollectionResult = {
  collectionId: string;
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

      const isPaid = isPaidCollection({
        accessType: payload.accessType,
        buyPrice: payload.buyPrice,
        rentPrice: payload.rentPrice,
        rentDuration: payload.rentDuration,
      });

      const partOfCollectionLabel = t("pricingLabels.partOfCollection", {
        defaultValue: "Part of a collection",
      });

      return {
        collectionId: payload.collectionId,
        accessType: payload.accessType,
        buyPrice: payload.buyPrice,
        rentPrice: payload.rentPrice,
        rentDuration: payload.rentDuration,
        isPaid,
        videos: payload.items.map((item) =>
          feedContentToTutorial(item, freeLabel, {
            inCollection: true,
            collectionId: payload.collectionId,
            isPaidCollection: isPaid,
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
