import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { API, useGetAPI } from "@/lib/http/api";
import {
  COLLECTION_ACCESS_STATUS,
  RentedContentSources,
} from "@/utils/viewerRented";
import { resolvePublicMediaUrl } from "@/utils/media";
import { UNKNOWN } from "@/utils/Constants";
import type { ContentType } from "@/utils/content";

type PurchasedMediaResponse = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  fileKey: string;
  creatorId: string;
  buyPrice: string;
  rentPrice: string;
  accessType: string;
  createdAt: string;
  contentType: ContentType;
  creatorName: string;
  categoryName: string | null;
  purchasedAt: string | null;
  rentExpiresAt: string | null;
};

type PurchasedCollectionResponse = {
  id: string;
  creatorId: string;
  creatorName: string | null;
  name: string;
  slug: string;
  coverImageUrl: string | null;
  description: string | null;
  elementCount: number;
  purchasedAt: string | null;
};

type PurchasedDataResponse = {
  success: boolean;
  message: string;
  data: {
    videos: PurchasedMediaResponse[];
    audios: PurchasedMediaResponse[];
    pdfs: PurchasedMediaResponse[];
    epubs?: PurchasedMediaResponse[];
    webs?: PurchasedMediaResponse[];
    collections: PurchasedCollectionResponse[];
  };
};

const mapMediaItem = (item: PurchasedMediaResponse, t: TFunction) => ({
  id: item.id,
  mediaType: item.contentType,
  category: item.categoryName || UNKNOWN,
  thumbSrc: resolvePublicMediaUrl(item.thumbnailUrl) || "",
  title: item.title,
  author: item.creatorName || "",
  accessStatus: COLLECTION_ACCESS_STATUS.PURCHASED,
  expiryText: item.purchasedAt
    ? t("viewerRented.purchasedOn", {
        date: new Date(item.purchasedAt).toLocaleDateString(),
      })
    : t("viewerRented.purchased"),
});

const mapCollectionItem = (item: PurchasedCollectionResponse) => ({
  id: item.id,
  title: item.name,
  author: item.creatorName || "",
  elementCount: item.elementCount ?? 0,
  coverSrc: resolvePublicMediaUrl(item.coverImageUrl) || "",
  accessStatus: COLLECTION_ACCESS_STATUS.PURCHASED,
});

export const useViewerPurchased = (enabled: boolean = true) => {
  const query = useGetAPI<PurchasedDataResponse>(
    API.viewer.purchasedData,
    undefined,
    {
      enabled,
    },
  );
  const { t } = useTranslation();

  const data = useMemo((): RentedContentSources | undefined => {
    const responseData = query.data?.data;
    if (!responseData) return undefined;

    return {
      videos: (responseData.videos || []).map((item) => mapMediaItem(item, t)),
      audios: (responseData.audios || []).map((item) => mapMediaItem(item, t)),
      pdfs: (responseData.pdfs || []).map((item) => mapMediaItem(item, t)),
      epubs: (responseData.epubs || []).map((item) => mapMediaItem(item, t)),
      webs: (responseData.webs || []).map((item) => mapMediaItem(item, t)),
      collections: (responseData.collections || []).map(mapCollectionItem),
    };
  }, [query.data, t]);

  return {
    data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
};
