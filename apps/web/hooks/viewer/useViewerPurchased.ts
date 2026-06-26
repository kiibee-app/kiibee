import { useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";
import { RentedContentSources } from "@/utils/viewerRented";
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
  name: string;
  slug: string;
  coverImageUrl: string | null;
  description: string | null;
  purchasedAt: string | null;
};

type PurchasedDataResponse = {
  success: boolean;
  message: string;
  data: {
    videos: PurchasedMediaResponse[];
    audios: PurchasedMediaResponse[];
    pdfs: PurchasedMediaResponse[];
    webs?: PurchasedMediaResponse[];
    collections: PurchasedCollectionResponse[];
  };
};

const mapMediaItem = (item: PurchasedMediaResponse) => ({
  id: item.id,
  mediaType: item.contentType,
  category: item.categoryName || UNKNOWN,
  thumbSrc: resolvePublicMediaUrl(item.thumbnailUrl) || "",
  title: item.title,
  author: item.creatorName || "",
  expiryText: item.purchasedAt
    ? `Purchased on ${new Date(item.purchasedAt).toLocaleDateString()}`
    : "Purchased",
});

const mapCollectionItem = (item: PurchasedCollectionResponse) => ({
  id: item.id,
  title: item.name,
  author: item.creatorId || "",
  elementCount: 0,
  coverSrc: resolvePublicMediaUrl(item.coverImageUrl) || "",
});

export const useViewerPurchased = (enabled: boolean = true) => {
  const query = useGetAPI<PurchasedDataResponse>(
    API.viewer.purchasedData,
    undefined,
    {
      enabled,
    },
  );

  const data = useMemo((): RentedContentSources | undefined => {
    const responseData = query.data?.data;
    if (!responseData) return undefined;

    return {
      videos: (responseData.videos || []).map(mapMediaItem),
      audios: (responseData.audios || []).map(mapMediaItem),
      pdfs: (responseData.pdfs || []).map(mapMediaItem),
      webs: (responseData.webs || []).map(mapMediaItem),
      collections: (responseData.collections || []).map(mapCollectionItem),
    };
  }, [query.data]);

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
