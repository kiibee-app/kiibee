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

      return {
        collectionId: payload.collectionId,
        name: payload.name,
        description: payload.description,
        videos: (payload.items || []).map((item) =>
          feedContentToTutorial(item, freeLabel, { inCollection: true }),
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
