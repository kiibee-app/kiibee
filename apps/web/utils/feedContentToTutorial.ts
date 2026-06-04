import recentCreator from "@/assets/images/creators/recent_creator.webp";
import { ACCESS_TYPE_FREE, VARIANT } from "@/utils/Constants";
import { pathPublishedContent } from "@/utils/path";
import {
  FORMAT_TYPE,
  type FormatType,
  type TutorialButton,
  type TutorialVideo,
} from "@/utils/types";

export type FeedContentItem = {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  creatorId?: string;
  creatorName?: string | null;
  contentType?: string | null;
  accessType?: string | null;
  categoryName?: string | null;
  buyPrice?: string | number | null;
  rentPrice?: string | number | null;
  publishedAgo?: string | null;
};

const CONTENT_TYPE_TO_FORMAT: Record<string, FormatType> = {
  video: FORMAT_TYPE.VIDEO,
  audio: FORMAT_TYPE.AUDIO,
  pdf: FORMAT_TYPE.PDF,
  epub: FORMAT_TYPE.EPUB,
  web: FORMAT_TYPE.WEB,
  "web link": FORMAT_TYPE.WEB,
};

function normalizeContentTypeKey(contentType?: string | null): string {
  if (!contentType) return "video";
  return contentType.trim().toLowerCase();
}

function resolveFormatType(contentType?: string | null): FormatType {
  const key = normalizeContentTypeKey(contentType);
  if (CONTENT_TYPE_TO_FORMAT[key]) {
    return CONTENT_TYPE_TO_FORMAT[key];
  }
  if (key.includes("web")) return FORMAT_TYPE.WEB;
  if (key.includes("epub")) return FORMAT_TYPE.EPUB;
  if (key.includes("pdf")) return FORMAT_TYPE.PDF;
  if (key.includes("audio")) return FORMAT_TYPE.AUDIO;
  return FORMAT_TYPE.VIDEO;
}

function formatFormatLabel(contentType?: string | null): string {
  const key = normalizeContentTypeKey(contentType);
  if (key === "web" || key === "web link") return "Web content";
  if (key === "epub") return "E-pub";
  if (!contentType) return "Video";
  return contentType;
}

function formatPriceLabel(
  prefix: string,
  price: string | number | null | undefined,
): string | null {
  if (price == null || price === "") return null;
  const num = Number(price);
  if (Number.isNaN(num) || num <= 0) return null;
  const amount = Number.isInteger(num) ? String(num) : String(Math.round(num));
  return `${prefix} ${amount} kr`;
}

export function dedupeFeedContentItems(
  items: FeedContentItem[],
): FeedContentItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function buildPricingButtons(
  item: FeedContentItem,
  freeLabel: string,
): TutorialButton[] {
  const href = pathPublishedContent(item.id);
  const base: Pick<TutorialButton, "variant" | "href"> = {
    variant: VARIANT.SECONDARY,
    href,
  };

  if (item.accessType === ACCESS_TYPE_FREE) {
    return [{ label: freeLabel, ...base }];
  }

  const buttons: TutorialButton[] = [];
  const rent = formatPriceLabel("Rent", item.rentPrice);
  if (rent) {
    buttons.push({ label: rent, ...base, href: `${href}#rent` });
  }

  const buy = formatPriceLabel("Buy", item.buyPrice);
  if (buy) {
    buttons.push({ label: buy, ...base, href: `${href}#buy` });
  }

  if (buttons.length === 0) {
    return [{ label: freeLabel, ...base }];
  }

  return buttons;
}

export function feedContentToTutorial(
  item: FeedContentItem,
  freeLabel: string,
): TutorialVideo {
  return {
    id: item.id,
    title: item.title,
    category: item.categoryName ?? "",
    creator: item.creatorName ?? "",
    creatorId: item.creatorId,
    published: item.publishedAgo ?? "",
    focus: item.description ?? "",
    level: item.accessType === ACCESS_TYPE_FREE ? "Free" : "",
    formatLabel: formatFormatLabel(item.contentType),
    formatType: resolveFormatType(item.contentType),
    image: item.thumbnailUrl || recentCreator,
    buttons: buildPricingButtons(item, freeLabel),
  };
}

export const FEED_CONTENT_PAGE_SIZE = 4;

export function getFeedPageSlice<T>(
  items: T[],
  startIndex: number,
  pageSize = FEED_CONTENT_PAGE_SIZE,
): T[] {
  if (items.length <= pageSize) return items;
  return items.slice(startIndex, startIndex + pageSize);
}
