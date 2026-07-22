import type { TFunction } from "i18next";
import { VIEWER_SECTION, VIEWER_SECTION_VALUES } from "@/utils/Constants";
import type { ContentType } from "@/utils/content";
import { MILLISECONDS_IN_HOUR, HOURS_IN_DAY } from "@/utils/Constants";
import { formatPriceLabel } from "@/utils/contentPricingActions";

export const MEDIA_ICON_SIZE = 22;

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
  buyPrice?: string | number | null;
  expiryText?: string;
  rentExpiresAt?: string | null;
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
  buyPrice?: string | null;
  rentPrice?: string | null;
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

export type RentedSectionKey =
  | "collections"
  | "videos"
  | "audios"
  | "pdfs"
  | "webs";

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
  WEB: "web",
} as const;

export const RENTED_SECTION_KEYS = {
  COLLECTIONS: "collections",
  VIDEOS: "videos",
  AUDIOS: "audios",
  PDFS: "pdfs",
  WEBS: "webs",
} as const;

export type RentedMediaSectionKey = Exclude<RentedSectionKey, "collections">;

type ViewerRentedMediaSection = {
  key: RentedMediaSectionKey;
  title: string;
};

export type RentedContentSources = {
  collections: RentedCollectionItem[];
  videos: RentedMediaItem[];
  audios: RentedMediaItem[];
  pdfs: RentedMediaItem[];
  webs: RentedMediaItem[];
};

export type RentedMediaSectionItems = Record<
  RentedMediaSectionKey,
  RentedMediaItem[]
>;

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
  webs: [],
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
    {
      key: RENTED_SECTION_KEYS.WEBS,
      title: t("dashboard.viewerPurchased.sections.web"),
    },
  ];
}

export function getRentedMediaSectionItems(items: {
  videos: RentedMediaItem[];
  audios: RentedMediaItem[];
  pdfs: RentedMediaItem[];
  webs: RentedMediaItem[];
}): RentedMediaSectionItems {
  return {
    [RENTED_SECTION_KEYS.VIDEOS]: items.videos,
    [RENTED_SECTION_KEYS.AUDIOS]: items.audios,
    [RENTED_SECTION_KEYS.PDFS]: items.pdfs,
    [RENTED_SECTION_KEYS.WEBS]: items.webs,
  };
}

export const RENTED_PAGE_SIZE: Record<RentedSectionKey, number> = {
  [RENTED_SECTION_KEYS.COLLECTIONS]: 2,
  [RENTED_SECTION_KEYS.VIDEOS]: 4,
  [RENTED_SECTION_KEYS.AUDIOS]: 4,
  [RENTED_SECTION_KEYS.PDFS]: 4,
  [RENTED_SECTION_KEYS.WEBS]: 4,
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

export function getMediaLabel(type: RentedSectionKey, t: TFunction) {
  const map: Record<string, string> = {
    [RENTED_SECTION_KEYS.VIDEOS]: t("viewerRented.mediaLabelVideo"),
    [RENTED_SECTION_KEYS.AUDIOS]: t("viewerRented.mediaLabelAudio"),
    [RENTED_SECTION_KEYS.PDFS]: t("viewerRented.mediaLabelPdf"),
    [RENTED_SECTION_KEYS.WEBS]: t("viewerRented.mediaLabelWeb"),
  };
  return map[type] ?? "";
}

export function getMediaAction(type: RentedSectionKey, t: TFunction) {
  const map: Record<string, string> = {
    [RENTED_SECTION_KEYS.VIDEOS]: t("viewerRented.playVideo"),
    [RENTED_SECTION_KEYS.AUDIOS]: t("viewerRented.playAudio"),
    [RENTED_SECTION_KEYS.PDFS]: t("viewerRented.openPdf"),
    [RENTED_SECTION_KEYS.WEBS]: t("viewerRented.openWeb"),
  };
  return map[type] ?? "";
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
      webs: [],
    };
  }

  return {
    collections: PREVIOUS_RENTED_COLLECTIONS,
    videos: PREVIOUS_RENTED_VIDEOS,
    audios: PREVIOUS_RENTED_AUDIOS,
    pdfs: PREVIOUS_RENTED_PDFS,
    webs: [],
  };
}

export function getCollectionBadgeText(mode: RentedMode, t: TFunction) {
  if (mode === RENTED_MODES.PURCHASED) return t("viewerRented.owned");
  if (mode === RENTED_MODES.CURRENTLY) return t("viewerRented.inRental");
  return t("viewerRented.rented");
}

export function getCollectionPrimaryActionText(
  mode: RentedMode,
  t: TFunction,
  item?: { buyPrice?: string | number | null } | Record<string, unknown>,
) {
  if (mode === RENTED_MODES.PURCHASED) return t("viewerRented.seeContent");

  const buyPriceLabel = formatPriceLabel(
    t("pricingLabels.buy", { defaultValue: "Buy" }),
    item?.buyPrice as string | number | null | undefined,
  );

  return buyPriceLabel ?? t("viewerRented.buyPlaceholder");
}

export function getSearchPlaceholder(mode: RentedMode, t: TFunction) {
  if (mode === RENTED_MODES.PURCHASED) return t("viewerRented.searchPurchased");
  if (mode === RENTED_MODES.CURRENTLY)
    return t("viewerRented.searchCurrentlyRented");
  return t("viewerRented.searchPreviouslyRented");
}

type ViewerSearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

export function getViewerExpandedSection(
  params: ViewerSearchParamsInput,
): RentedSectionKey | null {
  const value =
    params instanceof URLSearchParams
      ? params.get(VIEWER_SECTION)
      : params[VIEWER_SECTION];

  const stringValue = Array.isArray(value) ? value[0] : value;
  const validSections: string[] = Object.values(VIEWER_SECTION_VALUES);

  if (stringValue && validSections.includes(stringValue)) {
    return stringValue as RentedSectionKey;
  }

  return null;
}

export function syncViewerExpandedSectionParam(
  params: URLSearchParams,
  sectionKey: RentedSectionKey | null,
): void {
  if (sectionKey) {
    params.set(VIEWER_SECTION, sectionKey);
  } else {
    params.delete(VIEWER_SECTION);
  }
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

export const MEDIA_SORT_KEY_LIST: CollectionSortKey[] = [
  COLLECTION_SORT_KEYS.CREATOR,
  COLLECTION_SORT_KEYS.TITLE,
];

export function sortViewerMedia(
  items: RentedMediaItem[],
  sortKey: CollectionSortKey | null,
): RentedMediaItem[] {
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
    return 0;
  });
  return sorted;
}

export function formatExpiryText(
  rentExpiresAt: string | null | undefined,
  t: TFunction,
): string {
  const expiryDate = rentExpiresAt ? new Date(rentExpiresAt) : null;
  if (!expiryDate || isNaN(expiryDate.getTime())) return "";

  const hrs = Math.round(
    (expiryDate.getTime() - Date.now()) / MILLISECONDS_IN_HOUR,
  );
  const days = Math.round(hrs / HOURS_IN_DAY);

  if (hrs <= 0) return t("viewerRented.expired");
  if (days > 7) {
    const date = `${expiryDate.getDate()} ${expiryDate.toLocaleString(undefined, { month: "short" })} ${expiryDate.getFullYear()}`;
    return t("viewerRented.expiresDate", {
      date,
      defaultValue: `Expires ${date}`,
    });
  }

  const isHours = hrs < HOURS_IN_DAY;
  return t(
    isHours ? "viewerRented.expiresInHours" : "viewerRented.expiresInDays",
    {
      count: isHours ? hrs : days,
    },
  );
}

export function formatExpiredText(
  rentExpiresAt: string | null | undefined,
  t: TFunction,
): string {
  if (!rentExpiresAt) return "";
  const d = new Date(rentExpiresAt);
  if (isNaN(d.getTime())) return "";
  return t("viewerRented.expiredOn", {
    date: `${d.getDate()} ${d.toLocaleString(undefined, { month: "long" })} ${d.getFullYear()}`,
  });
}

export function isUrgentExpiry(rentExpiresAt?: string | null): boolean {
  if (!rentExpiresAt) return false;
  const expiryDate = new Date(rentExpiresAt);
  if (isNaN(expiryDate.getTime())) return false;
  const daysLeft = (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return daysLeft <= 7;
}
