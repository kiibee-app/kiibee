"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  CollectionContentsApiResponse,
  CollectionsApiResponse,
  getCollectionContentRows,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { resolveContentThumbnailUrl } from "@/utils/media";
import { getContentTypeLabel } from "@/utils/content";
import {
  getContentDetail,
  type ContentDetailResponse,
} from "@/utils/contentApi";
import { tutorialVideos } from "@/utils/data";
import { QUERY_KEYS } from "@/utils/Constants";
import { buildPricingButtonsForContent } from "@/utils/contentPricingActions";
import { type TutorialVideo } from "@/utils/types";

export type CollectionWithCards = {
  id: string;
  name: string;
  cards: TutorialVideo[];
};

export function useProfileHomeCollections(displayName: string, enabled = true) {
  const { t } = useTranslation();
  const seeContentLabel = t("createProfileHome.latestUpload.seeContent");
  const queryClient = useQueryClient();

  return useQuery<CollectionWithCards[]>({
    queryKey: [QUERY_KEYS.PROFILE_HOME_COLLECTIONS_PREVIEW, { displayName }],
    queryFn: async () => {
      const collectionsResponse = await axiosClient.get<CollectionsApiResponse>(
        API.collection.getAll,
      );
      const collections = getCollectionRows(collectionsResponse.data);

      if (!collections.length) return [];

      const contentsResponses = await Promise.all(
        collections.map((item) =>
          axiosClient.get<CollectionContentsApiResponse>(
            API.content.collection(item.id),
          ),
        ),
      );

      const collectionSections = await Promise.all(
        collections.map(async (collection, collectionIndex) => {
          const contentRows = getCollectionContentRows(
            contentsResponses[collectionIndex]?.data,
          );

          const cards = await Promise.all(
            contentRows.map(async (content, contentIndex) => {
              const fallbackTemplate =
                tutorialVideos[
                  (collectionIndex + contentIndex) % tutorialVideos.length
                ];

              const contentData =
                await queryClient.ensureQueryData<ContentDetailResponse>({
                  queryKey: [API.content.get(content.id)],
                  queryFn: async () => {
                    const res = await axiosClient.get<ContentDetailResponse>(
                      API.content.get(content.id),
                    );
                    return res.data;
                  },
                });
              const contentDetail = getContentDetail(contentData);

              const buttons = buildPricingButtonsForContent(
                content.id,
                contentDetail,
                seeContentLabel,
              );

              return {
                ...fallbackTemplate,
                id: content.id,
                title: content.name,
                creator: displayName || fallbackTemplate.creator,
                published: content.createdAt,
                formatType: content.contentType,
                formatLabel: getContentTypeLabel(content.contentType),
                image:
                  resolveContentThumbnailUrl(
                    contentDetail?.thumbnailUrl,
                    contentDetail?.thumbnailLandscapeUrl,
                  ) ?? fallbackTemplate.image,
                buttons,
              };
            }),
          );

          return { id: collection.id, name: collection.name, cards };
        }),
      );

      return collectionSections.filter((section) => section.cards.length > 0);
    },
    enabled,
    refetchOnWindowFocus: false,
  });
}
