"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import {
  CollectionContentsApiResponse,
  CollectionsApiResponse,
  getCollectionContentRows,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { getContentTypeLabel } from "@/utils/content";
import {
  getContentDetail,
  type ContentDetailResponse,
} from "@/utils/contentApi";
import { tutorialVideos } from "@/utils/data";
import type { TutorialVideo } from "@/utils/types";
import { useCreatorChannelProfile } from "./useCreatorChannelProfile";

export type RelatedCollectionResult = {
  collectionId: string;
  videos: TutorialVideo[];
};

type Options = {
  enabled?: boolean;
};

export function useRelatedCollectionContent(
  contentId?: string | null,
  options?: Options,
) {
  const { displayName } = useCreatorChannelProfile();

  return useQuery<RelatedCollectionResult | null>({
    queryKey: ["related-collection-content", contentId],
    enabled: Boolean(contentId) && (options?.enabled ?? true),
    queryFn: async () => {
      if (!contentId) return null;

      const collectionsResponse = await axiosClient.get<CollectionsApiResponse>(
        API.collection.getAll,
      );
      const collections = getCollectionRows(collectionsResponse.data);
      if (!collections.length) return null;

      const contentsResponses = await Promise.all(
        collections.map((item) =>
          axiosClient.get<CollectionContentsApiResponse>(
            API.content.collection(item.id),
          ),
        ),
      );
      const collectionMatch = collections.find((collection, index) =>
        getCollectionContentRows(contentsResponses[index]?.data).some(
          (row) => row.id === contentId,
        ),
      );
      if (!collectionMatch) return null;

      const matchedIndex = collections.findIndex(
        (collection) => collection.id === collectionMatch.id,
      );
      const relatedRows = getCollectionContentRows(
        contentsResponses[matchedIndex]?.data,
      ).filter((row) => row.id !== contentId);

      if (!relatedRows.length) return null;

      const relatedCards = await Promise.all(
        relatedRows.map(async (row, index) => {
          const fallback = tutorialVideos[index % tutorialVideos.length];
          const response = await axiosClient.get<ContentDetailResponse>(
            API.content.get(row.id),
          );
          const detail = getContentDetail(response.data);

          return {
            ...fallback,
            id: row.id,
            title: row.name,
            creator: displayName?.trim(),
            category: detail?.categories?.[0]?.id,
            published: row.createdAt,
            focus: row.description ?? fallback.focus,
            level: fallback.level,
            formatLabel: getContentTypeLabel(row.contentType),
            formatType: row.contentType,
            image: detail?.thumbnailUrl ?? fallback.image,
            buttons: fallback.buttons,
          } as TutorialVideo;
        }),
      );

      return {
        collectionId: collectionMatch.id,
        videos: relatedCards,
      };
    },
  });
}
