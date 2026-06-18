import type { TFunction } from "i18next";
import { VIEWER_SECTION, VIEWER_SECTION_VALUES } from "@/utils/Constants";
import type { ContentType } from "@/utils/content";

export type CollectionAction = {
  label: string;
  sublabel?: string;
  variant?: "primary" | "secondary";
  href?: string;
};

export type RentedCollectionItem = {
  id: string;
  title: string;
  author: string;
  elementCount: number;
  coverSrc: string;
  actions?: CollectionAction[];
  hideBadge?: boolean;
  href?: string;
};

export type RentedMediaItem = {
  id: string;
  mediaType: RentedMediaType;
  category: string;
  thumbSrc: string;
  title: string;
  author: string;
  expiryText: string;
};
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

export type RentedSectionKey = "collections" | "videos" | "audios" | "pdfs";

export const RENTED_MODES = {
  PURCHASED: "purchased",
  CURRENTLY: "currently",
  PREVIOUSLY: "previously",
} as const;

export type RentedMode = (typeof RENTED_MODES)[keyof typeof RENTED_MODES];
export type RentedMediaType = ContentType;

export const RENTED_MEDIA_TYPES = {
  VIDEO: "video",
  AUDIO: "audio",
  PDF: "pdf",
} as const;

export const RENTED_SECTION_KEYS = {
  COLLECTIONS: "collections",
  VIDEOS: "videos",
  AUDIOS: "audios",
  PDFS: "pdfs",
} as const;

type ViewerRentedMediaSection = {
  key: Exclude<RentedSectionKey, "collections">;
  title: string;
};

export type RentedContentSources = {
  collections: RentedCollectionItem[];
  videos: RentedMediaItem[];
  audios: RentedMediaItem[];
  pdfs: RentedMediaItem[];
};

const PURCHASED_SOURCES: RentedContentSources = {
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

export function getRentedMediaSections(
  t: TFunction,
): ViewerRentedMediaSection[] {
  return [
    {
      key: RENTED_SECTION_KEYS.VIDEOS,
      title: t("dashboard.viewerPurchased.sections.videos"),
    },
    {
      key: RENTED_SECTION_KEYS.AUDIOS,
      title: t("dashboard.viewerPurchased.sections.audios"),
    },
    {
      key: RENTED_SECTION_KEYS.PDFS,
      title: t("dashboard.viewerPurchased.sections.pdf"),
    },
  ];
}

export const RENTED_PAGE_SIZE: Record<RentedSectionKey, number> = {
  [RENTED_SECTION_KEYS.COLLECTIONS]: 2,
  [RENTED_SECTION_KEYS.VIDEOS]: 4,
  [RENTED_SECTION_KEYS.AUDIOS]: 4,
  [RENTED_SECTION_KEYS.PDFS]: 4,
};

export function paginateSectionItems<T>(
  items: T[],
  startIndex: number,
  pageSize: number,
): T[] {
  if (items.length <= pageSize) return items;
  return items.slice(startIndex, startIndex + pageSize);
}

export function filterCollections(
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

export function filterMedia(searchValue: string, items: RentedMediaItem[]) {
  const needle = searchValue.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) =>
    [item.title, item.author, item.category, item.expiryText].some((part) =>
      part.toLowerCase().includes(needle),
    ),
  );
}

export function getMediaLabel(
  type: RentedMediaItem["mediaType"],
  t?: TFunction,
) {
  if (type === RENTED_MEDIA_TYPES.AUDIO)
    return t ? t("viewerRented.mediaLabelAudio") : "Audio";
  if (type === RENTED_MEDIA_TYPES.PDF)
    return t ? t("viewerRented.mediaLabelPdf") : "PDF";
  return t ? t("viewerRented.mediaLabelVideo") : "Video";
}

export function getMediaAction(
  type: RentedMediaItem["mediaType"],
  t?: TFunction,
) {
  if (type === RENTED_MEDIA_TYPES.AUDIO)
    return t ? t("viewerRented.playAudio") : "Play audio";
  if (type === RENTED_MEDIA_TYPES.PDF)
    return t ? t("viewerRented.openPdf") : "Open pdf";
  return t ? t("viewerRented.playVideo") : "Play video";
}

export function getRentedContentSources(
  mode: RentedMode,
): RentedContentSources {
  if (mode === RENTED_MODES.PURCHASED) return PURCHASED_SOURCES;

  if (mode === RENTED_MODES.CURRENTLY) {
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

export function getCollectionBadgeText(mode: RentedMode, t?: TFunction) {
  if (mode === RENTED_MODES.PURCHASED)
    return t ? t("viewerRented.owned") : "Owned";
  if (mode === RENTED_MODES.CURRENTLY)
    return t ? t("viewerRented.inRental") : "In rental";
  return t ? t("viewerRented.rented") : "Rented";
}

export function getCollectionPrimaryActionText(mode: RentedMode) {
  if (mode === RENTED_MODES.PURCHASED) return "See content";
  return "Buy xx kr";
}

export const ACTIVE_RENTAL_TEXT = {
  title: "Active rental",
  expiresIn: "Expires in 2 days",
} as const;

export const RENTED_BUTTON_TEXT = {
  buy: "Buy xx kr",
  rent: "Rent xx kr",
} as const;

export function getSearchPlaceholder(mode: RentedMode, t?: TFunction) {
  if (mode === RENTED_MODES.PURCHASED)
    return t ? t("viewerRented.searchPurchased") : "Search Purchased Content";
  if (mode === RENTED_MODES.CURRENTLY)
    return t
      ? t("viewerRented.searchCurrentlyRented")
      : "Search Currently Rented";
  return t
    ? t("viewerRented.searchPreviouslyRented")
    : "Search Previously Rented";
}

type ViewerSearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

export function isViewerCollectionsSectionExpanded(
  params: ViewerSearchParamsInput,
): boolean {
  const value =
    params instanceof URLSearchParams
      ? params.get(VIEWER_SECTION)
      : params[VIEWER_SECTION];

  if (Array.isArray(value)) {
    return value.includes(VIEWER_SECTION_VALUES.COLLECTIONS);
  }

  return value === VIEWER_SECTION_VALUES.COLLECTIONS;
}

export function syncViewerCollectionsSectionParam(
  params: URLSearchParams,
  expanded: boolean,
): void {
  const sync = expanded
    ? () => params.set(VIEWER_SECTION, VIEWER_SECTION_VALUES.COLLECTIONS)
    : () => params.delete(VIEWER_SECTION);
  sync();
}

export const COLLECTION_SORT_KEYS = {
  CREATOR: "creator",
  TITLE: "title",
  ELEMENTS: "elements",
} as const;

export type CollectionSortKey =
  (typeof COLLECTION_SORT_KEYS)[keyof typeof COLLECTION_SORT_KEYS];

export const COLLECTION_SORT_KEY_LIST: CollectionSortKey[] = [
  COLLECTION_SORT_KEYS.CREATOR,
  COLLECTION_SORT_KEYS.TITLE,
  COLLECTION_SORT_KEYS.ELEMENTS,
];

export const COLLECTION_SORT_LABELS: Record<CollectionSortKey, string> = {
  [COLLECTION_SORT_KEYS.CREATOR]: "Creator name",
  [COLLECTION_SORT_KEYS.TITLE]: "Title",
  [COLLECTION_SORT_KEYS.ELEMENTS]: "Elements",
};

export function sortViewerCollections(
  items: RentedCollectionItem[],
  sortKey: CollectionSortKey | null,
): RentedCollectionItem[] {
  if (!sortKey) return items;

  const sorted = [...items];
  sorted.sort((a, b) => {
    if (sortKey === COLLECTION_SORT_KEYS.CREATOR) {
      return a.author.localeCompare(b.author, undefined, {
        sensitivity: "base",
      });
    }
    if (sortKey === COLLECTION_SORT_KEYS.TITLE) {
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    }
    return a.elementCount - b.elementCount;
  });
  return sorted;
}

export function formatExpiryText(rentExpiresAt?: string | null): string {
  if (!rentExpiresAt) return "";
  const hrs = Math.round(
    (new Date(rentExpiresAt).getTime() - Date.now()) / 36e5,
  );
  if (hrs <= 0) return "Expired";
  return hrs < 24
    ? `Expires in ${hrs} hrs`
    : `Expires in ${Math.round(hrs / 24)} days`;
}

export function formatExpiredText(rentExpiresAt?: string | null): string {
  if (!rentExpiresAt) return "";
  const d = new Date(rentExpiresAt);
  if (isNaN(d.getTime())) return "";
  return `Expired on ${d.getDate()} ${d.toLocaleString(undefined, { month: "long" })} ${d.getFullYear()}`;
}
