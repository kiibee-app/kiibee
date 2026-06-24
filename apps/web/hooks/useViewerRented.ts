"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { API, useGetAPI } from "@/lib/http/api";
import { resolvePublicMediaUrl } from "@/utils/media";
import {
  RENTED_MODES,
  formatExpiryText,
  formatExpiredText,
  RentedMode,
  RentedMediaItem,
  RentedCollectionItem,
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
  t: TFunction,
): RentedMediaItem {
  return {
    id: item.id,
    mediaType:
      (item.contentType?.toLowerCase() as RentedMediaItem["mediaType"]) ?? "",
    category: item.categoryName ?? "",
    thumbSrc: resolvePublicMediaUrl(item.thumbnailUrl) ?? "",
    title: item.title ?? "",
    author: item.creatorName ?? "",
    rentExpiresAt: item.rentExpiresAt ?? null,
    expiryText:
      mode === RENTED_MODES.PREVIOUSLY
        ? formatExpiredText(item.rentExpiresAt, t)
        : formatExpiryText(item.rentExpiresAt, t),
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
  const { t } = useTranslation();

  const sources = useMemo(() => {
    const data = query.data?.data;
    if (!data) return { collections: [], videos: [], audios: [], pdfs: [] };

    return {
      collections: data.collections.map(toCollectionItem),
      videos: data.videos.map((item) => toMediaItem(item, mode, t)),
      audios: data.audios.map((item) => toMediaItem(item, mode, t)),
      pdfs: data.pdfs.map((item) => toMediaItem(item, mode, t)),
    };
  }, [query.data, mode, t]);

  return {
    sources,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
