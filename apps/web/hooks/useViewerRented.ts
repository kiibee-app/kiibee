"use client";

import { useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";
import { resolvePublicMediaUrl } from "@/utils/media";
import type {
  RentedCollectionItem,
  RentedMediaItem,
  RentedMode,
} from "@/utils/dummyData/viewerRentedMockData";
import {
  RENTED_MODES,
  formatExpiryText,
  formatExpiredText,
} from "@/utils/viewerRented";

type BackendMediaItem = {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  fileKey?: string | null;
  creatorId: string;
  buyPrice?: string | null;
  rentPrice?: string | null;
  accessType?: string;
  createdAt?: string;
  contentType?: string;
  creatorName?: string;
  categoryName?: string | null;
  purchasedAt?: string | null;
  rentExpiresAt?: string | null;
};

type BackendCollectionItem = {
  id: string;
  name: string;
  coverImageUrl?: string | null;
  description?: string | null;
  creatorId: string;
  creatorName?: string;
  elementCount?: number;
  purchasedAt?: string | null;
};

type ViewerDataResponse = {
  success: boolean;
  message: string;
  data: {
    videos: BackendMediaItem[];
    audios: BackendMediaItem[];
    pdfs: BackendMediaItem[];
    collections: BackendCollectionItem[];
  };
};

function toMediaItem(
  item: BackendMediaItem,
  mode: RentedMode,
): RentedMediaItem {
  return {
    id: item.id,
    mediaType:
      (item.contentType?.toLowerCase() as RentedMediaItem["mediaType"]) ?? "",
    category: item.categoryName ?? "",
    thumbSrc: resolvePublicMediaUrl(item.thumbnailUrl) ?? "",
    title: item.title ?? "",
    author: item.creatorName ?? "",
    expiryText:
      mode === RENTED_MODES.PREVIOUSLY
        ? formatExpiredText(item.rentExpiresAt)
        : formatExpiryText(item.rentExpiresAt),
  };
}

function toCollectionItem(item: BackendCollectionItem): RentedCollectionItem {
  return {
    id: item.id,
    title: item.name ?? "",
    author: item.creatorName ?? "",
    elementCount: item.elementCount ?? 0,
    coverSrc: resolvePublicMediaUrl(item.coverImageUrl) ?? "",
  };
}

const ENDPOINT_MAP: Record<RentedMode, string> = {
  [RENTED_MODES.CURRENTLY]: API.viewer.rentedData,
  [RENTED_MODES.PREVIOUSLY]: API.viewer.previouslyRentedData,
  [RENTED_MODES.PURCHASED]: API.viewer.purchasedData,
};

export const useViewerRentedData = (mode: RentedMode) => {
  const query = useGetAPI<ViewerDataResponse>(ENDPOINT_MAP[mode]);

  const sources = useMemo(() => {
    const data = query.data?.data;
    if (!data) return { collections: [], videos: [], audios: [], pdfs: [] };

    return {
      collections: data.collections.map(toCollectionItem),
      videos: data.videos.map((item) => toMediaItem(item, mode)),
      audios: data.audios.map((item) => toMediaItem(item, mode)),
      pdfs: data.pdfs.map((item) => toMediaItem(item, mode)),
    };
  }, [query.data, mode]);

  return {
    sources,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
