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
import { tutorialVideoCardFallback } from "@/utils/data";
import { QUERY_KEYS, VARIANT } from "@/utils/Constants";
import { type TutorialVideo } from "@/utils/types";
import { pathPublishedContent } from "@/utils/path";
import {
  feedContentToTutorial,
  type FeedContentItem,
} from "@/utils/feedContentToTutorial";
import {
  getContentPricingActions,
  getPricingLabels,
  isPaidCollection,
} from "@/utils/contentPricingActions";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";

export type CollectionWithCards = {
  id: string;
  name: string;
  slug?: string;
  cards: TutorialVideo[];
};

type PublicCollectionContentResponse = {
  data?: {
    items?: FeedContentItem[];
  } | null;
};

export function useProfileHomeCollections(
  displayName: string,
  enabled = true,
  publicCreatorId?: string | null,
) {
  const { t } = useTranslation();
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
  const queryClient = useQueryClient();

  return useQuery<CollectionWithCards[]>({
    queryKey: [
      QUERY_KEYS.PROFILE_HOME_COLLECTIONS_PREVIEW,
      { displayName, publicCreatorId },
    ],
    queryFn: async () => {
      const collectionsResponse = await axiosClient.get<CollectionsApiResponse>(
        publicCreatorId
          ? API.collection.getPublicByCreator(publicCreatorId)
          : API.collection.getAll,
      );
      const collections = getCollectionRows(collectionsResponse.data);

      if (!collections.length) return [];

      if (publicCreatorId) {
        const publicContentResponses = await Promise.all(
          collections.map((collection) =>
            axiosClient.get<PublicCollectionContentResponse>(
              API.content.publicCollection(collection.id),
            ),
          ),
        );

        return collections
          .map((collection, index) => {
            const isPaid = isPaidCollection(collection);
            const partOfCollectionLabel = t("pricingLabels.partOfCollection");
            return {
              id: collection.id,
              name: collection.name,
              slug: collection.slug,
              cards: (
                publicContentResponses[index]?.data?.data?.items ?? []
              ).map((item) =>
                feedContentToTutorial(
                  {
                    ...item,
                  },
                  freeLabel,
                  {
                    inCollection: true,
                    collectionId: collection.id,
                    isPaidCollection: isPaid,
                    collectionAccessType: collection.accessType,
                    partOfCollectionLabel,
                    labels: getPricingLabels(t),
                  },
                ),
              ),
            };
          })
          .filter((collection) => collection.cards.length > 0);
      }

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
            contentRows.map(async (content) => {
              const fallbackTemplate = tutorialVideoCardFallback;

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

              const pricingItem = {
                accessType: contentDetail?.accessType,
                buyPrice: contentDetail?.buyPrice,
                rentPrice: contentDetail?.rentPrice,
                rentDurationHours: contentDetail?.rentDurationHours,
              };

              const pricingActions = getContentPricingActions(
                pricingItem,
                freeLabel,
                { labels: getPricingLabels(t) },
              );

              const contentHref = pathPublishedContent(
                contentDetail?.slug || content.id,
                contentDetail?.creatorSlug,
                contentDetail?.title || content.name,
              );

              const buttons = pricingActions.map((action) => ({
                label: action.label,
                variant: VARIANT.SECONDARY,
                href: contentHref,
                fullWidth: action.fullWidth,
              }));

              return {
                ...fallbackTemplate,
                id: content.id,
                slug: contentDetail?.slug,
                creatorSlug: contentDetail?.creatorSlug,
                title: content.name,
                category:
                  contentDetail?.categories?.[0]?.name ??
                  contentDetail?.categories?.[0]?.id ??
                  "",
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
