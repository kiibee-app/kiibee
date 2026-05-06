import type {
  RentedMode,
  RentedCollectionItem,
  RentedMediaItem,
} from "@/utils/dummyData/viewerRentedMockData";
import {
  CURRENT_RENTED_AUDIOS,
  CURRENT_RENTED_COLLECTIONS,
  CURRENT_RENTED_PDFS,
  CURRENT_RENTED_VIDEOS,
  PREVIOUS_RENTED_AUDIOS,
  PREVIOUS_RENTED_COLLECTIONS,
  PREVIOUS_RENTED_PDFS,
  PREVIOUS_RENTED_VIDEOS,
} from "@/utils/dummyData/viewerRentedMockData";
import {
  MOCK_PURCHASED_AUDIOS,
  MOCK_PURCHASED_COLLECTIONS,
  MOCK_PURCHASED_PDFS,
  MOCK_PURCHASED_VIDEOS,
} from "@/utils/dummyData/viewerPurchasedMockData";

export type ViewerRentedSectionKey =
  | "collections"
  | "videos"
  | "audios"
  | "pdfs";

type ViewerRentedMediaSection = {
  key: Exclude<ViewerRentedSectionKey, "collections">;
  title: string;
};

export type ViewerRentedSources = {
  collections: RentedCollectionItem[];
  videos: RentedMediaItem[];
  audios: RentedMediaItem[];
  pdfs: RentedMediaItem[];
};

const PURCHASED_SOURCES: ViewerRentedSources = {
  collections: MOCK_PURCHASED_COLLECTIONS.map((item) => ({ ...item })),
  videos: MOCK_PURCHASED_VIDEOS.map((item) => ({
    ...item,
    expiryText: item.dateLabel,
  })),
  audios: MOCK_PURCHASED_AUDIOS.map((item) => ({
    ...item,
    expiryText: item.dateLabel,
  })),
  pdfs: MOCK_PURCHASED_PDFS.map((item) => ({
    ...item,
    expiryText: item.dateLabel,
  })),
};

export const VIEWER_RENTED_MEDIA_SECTIONS: ViewerRentedMediaSection[] = [
  { key: "videos", title: "Videos" },
  { key: "audios", title: "Audios" },
  { key: "pdfs", title: "PDF" },
];

export const VIEWER_RENTED_PAGE_SIZE: Record<ViewerRentedSectionKey, number> = {
  collections: 2,
  videos: 4,
  audios: 4,
  pdfs: 4,
};

export function paginateViewerRentedItems<T>(
  items: T[],
  startIndex: number,
  pageSize: number,
): T[] {
  if (items.length <= pageSize) return items;
  const result: T[] = [];
  for (let i = 0; i < pageSize; i += 1) {
    result.push(items[(startIndex + i) % items.length]);
  }
  return result;
}

export function filterViewerRentedCollections(
  searchValue: string,
  items: RentedCollectionItem[],
) {
  const needle = searchValue.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) =>
    [item.title, item.author, String(item.elementCount)].some((part) =>
      part.toLowerCase().includes(needle),
    ),
  );
}

export function filterViewerRentedMedia(
  searchValue: string,
  items: RentedMediaItem[],
) {
  const needle = searchValue.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) =>
    [item.title, item.author, item.category, item.expiryText].some((part) =>
      part.toLowerCase().includes(needle),
    ),
  );
}

export function getViewerRentedMediaLabel(type: RentedMediaItem["mediaType"]) {
  if (type === "audio") return "Audio";
  if (type === "pdf") return "PDF";
  return "Video";
}

export function getViewerRentedMediaAction(type: RentedMediaItem["mediaType"]) {
  if (type === "audio") return "Play audio";
  if (type === "pdf") return "Open pdf";
  return "Play video";
}

export function getViewerRentedSources(mode: RentedMode): ViewerRentedSources {
  if (mode === "purchased") return PURCHASED_SOURCES;

  if (mode === "currently") {
    return {
      collections: CURRENT_RENTED_COLLECTIONS,
      videos: CURRENT_RENTED_VIDEOS,
      audios: CURRENT_RENTED_AUDIOS,
      pdfs: CURRENT_RENTED_PDFS,
    };
  }

  return {
    collections: PREVIOUS_RENTED_COLLECTIONS,
    videos: PREVIOUS_RENTED_VIDEOS,
    audios: PREVIOUS_RENTED_AUDIOS,
    pdfs: PREVIOUS_RENTED_PDFS,
  };
}

export function getCollectionBadgeLabel(mode: RentedMode) {
  if (mode === "purchased") return "Owned";
  if (mode === "currently") return "In rental";
  return "Rented";
}

export function getCollectionPrimaryButtonLabel(mode: RentedMode) {
  if (mode === "purchased") return "See content";
  return "Buy xx kr";
}

export const COLLECTION_RENTAL_STATUS_LABELS = {
  title: "Active rental",
  expiresIn: "Expires in 2 days",
} as const;
