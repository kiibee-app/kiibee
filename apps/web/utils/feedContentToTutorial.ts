import recentCreator from "@/assets/images/creators/recent_creator.webp";
import {
  getContentPricingActions,
  isFreeContentItem,
  resolveContentActionHref,
  type PricingLabels,
} from "@/utils/contentPricingActions";
import { ACCESS_TYPE_FREE, VARIANT } from "@/utils/Constants";
import { resolvePublicMediaUrl } from "@/utils/media";
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
  thumbnailLandscapeUrl?: string | null;
  creatorId?: string;
  creatorName?: string | null;
  contentType?: string | null;
  accessType?: string | null;
  categoryName?: string | null;
  buyPrice?: string | number | null;
  rentPrice?: string | number | null;
  publishedAgo?: string | null;
  createdAt?: string | null;
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
  options?: { inCollection?: boolean; labels?: PricingLabels },
): TutorialButton[] {
  const actions = getContentPricingActions(item, freeLabel, options);
  const requiresAuth = !isFreeContentItem(item);

  return actions.map((action) => ({
    label: action.label,
    variant: VARIANT.SOFT_OUTLINE,
    href: resolveContentActionHref(
      item.id,
      action.label,
      item,
      actions.length,
      options,
    ),
    requiresAuth,
    fullWidth: action.fullWidth,
  }));
}

export function feedContentToTutorial(
  item: FeedContentItem,
  freeLabel: string,
  options?: { inCollection?: boolean; labels?: PricingLabels },
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
    isFree: isFreeContentItem(item),
    formatLabel: formatFormatLabel(item.contentType),
    formatType: resolveFormatType(item.contentType),
    image:
      resolvePublicMediaUrl(item.thumbnailLandscapeUrl ?? item.thumbnailUrl) ||
      recentCreator,
    buttons: buildPricingButtons(item, freeLabel, options),
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
