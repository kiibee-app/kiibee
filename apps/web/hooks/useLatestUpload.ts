"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import {
  CollectionContentsApiResponse,
  CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { QUERY_KEYS } from "@/utils/Constants";
import {
  getContentDetail,
  type ContentDetailResponse,
} from "@/utils/contentApi";
import { CollectionContentRow } from "@/types/collectionsType";
import type { ImageSource } from "@/utils/Constants";
import type { FeedContentItem } from "@/utils/feedContentToTutorial";
import { convertRentDurationToHours } from "@/utils/formatDate";
import { resolveContentThumbnailUrl } from "@/utils/media";

type LatestUploadItem = Omit<CollectionContentRow, "createdAt"> & {
  createdAt: number;
  category?: string | null;
  thumbnailLandscapeUrl?: ImageSource | null;
  accessType?: string | null;
  buyPrice?: string | number | null;
  rentPrice?: string | number | null;
  rentDurationHours?: string | number | null;
  collectionId?: string;
};

export function useLatestUpload(publicCreatorId: string | null = null) {
  const isPublicView = Boolean(publicCreatorId);

  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE_LATEST_UPLOAD, { publicCreatorId }],

    queryFn: async () => {
      if (isPublicView) {
        if (!publicCreatorId) return null;

        const response = await axiosClient.post<{
          success?: boolean;
          message?: string;
          data?: FeedContentItem[] | null;
        }>(API.content.all, { creatorId: publicCreatorId });

        const items = response.data?.data;
        if (!Array.isArray(items) || items.length === 0) return null;

        const latest = items[0];

        return {
          id: String(latest.id),
          name: latest.title || "",
          title: latest.title || "",
          description: latest.description ?? "",
          createdAt: latest.createdAt
            ? new Date(latest.createdAt).getTime()
            : Date.now(),
          category: latest.categoryName ?? null,
          contentType: latest.contentType ?? "video",
          thumbnailLandscapeUrl:
            resolveContentThumbnailUrl(
              latest.thumbnailUrl,
              latest.thumbnailLandscapeUrl,
              { preferLandscape: true },
            ) ?? null,
          accessType: latest.accessType ?? null,
          buyPrice: latest.buyPrice ?? null,
          rentPrice: latest.rentPrice ?? null,
        } as LatestUploadItem;
      }

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

      const allContents: LatestUploadItem[] = contentsResponses
        .flatMap((res, collectionIndex) => {
          const data = res.data as
            | CollectionContentRow[]
            | { data: CollectionContentRow[] };

          const rows = Array.isArray(data) ? data : (data?.data ?? []);
          return rows.map((row) => ({
            row,
            collectionId: collections[collectionIndex]?.id,
          }));
        })
        .map(({ row, collectionId }) => ({
          ...row,
          createdAt: new Date(row.createdAt).getTime(),
          collectionId,
        }))
        .filter((i) => !isNaN(i.createdAt));

      allContents.sort((a, b) => b.createdAt - a.createdAt);

      const latest = allContents[0];
      if (!latest) return null;

      const parentCollection = collections.find(
        (c) => c.id === latest.collectionId,
      );

      try {
        const res = await axiosClient.get<ContentDetailResponse>(
          API.content.get(String(latest.id)),
        );
        const content = getContentDetail(res.data);
        const category = content?.categories?.[0]?.id;

        return {
          ...latest,
          title: content?.title || latest.name || "",
          category: category ?? null,
          thumbnailLandscapeUrl:
            resolveContentThumbnailUrl(
              content?.thumbnailUrl,
              content?.thumbnailLandscapeUrl,
              { preferLandscape: true },
            ) ?? null,
          accessType: parentCollection?.accessType ?? null,
          buyPrice: parentCollection?.buyPrice ?? null,
          rentPrice: parentCollection?.rentPrice ?? null,
          rentDurationHours: convertRentDurationToHours(
            parentCollection?.rentDuration,
          ),
        };
      } catch {
        return {
          ...latest,
          title: latest.name || "",
          category: null,
          thumbnailLandscapeUrl: null,
          accessType: parentCollection?.accessType ?? null,
          buyPrice: parentCollection?.buyPrice ?? null,
          rentPrice: parentCollection?.rentPrice ?? null,
          rentDurationHours: convertRentDurationToHours(
            parentCollection?.rentDuration,
          ),
        };
      }
    },

    refetchOnWindowFocus: true,
  });
}
