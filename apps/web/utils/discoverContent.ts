import imageOne from "@/assets/images/discover-content/3545227dd1e7a9cd6faf3b14586708d85137ed35.webp";
import imageTwo from "@/assets/images/discover-content/4ccc137164285071261595311fa290373bc45c72.webp";
import imageThree from "@/assets/images/discover-content/52c1c126e76296e3c8e39b9ac60f6d9a34156583.webp";
import imageFour from "@/assets/images/discover-content/c9051991a79ffc5a50dd15afe7b8c86e09f7faad.webp";
import {
  ACCESS_TYPE_FREE,
  ImageSource,
  MEDIA_TYPE_EPUB_KEY,
  FREE_LABEL,
  RENT_PREFIX,
  BUY_PREFIX,
  FALLBACK_MEDIA_TYPE_LABEL,
  resolveMediaType,
  MEDIA_TYPE,
} from "./Constants";
import { type FeedContentItem } from "./feedContentToTutorial";
import fallbackImage from "@/assets/images/discover-content/3545227dd1e7a9cd6faf3b14586708d85137ed35.webp";

export type DiscoverContentAction = {
  labelKey: string;
  fullWidth?: boolean;
};

export type DiscoverContentMediaType = "video" | "epub";

export type DiscoverContentItem = {
  id: number | string;
  contentKey: string;
  categoryKey: string;
  image: ImageSource;
  titleKey: string;
  authorKey: string;
  dateKey: string;
  mediaType: DiscoverContentMediaType;
  mediaTypeKey: string;
  actions: DiscoverContentAction[];
};

export function formatPriceLabel(
  prefix: string,
  price: string | number | null | undefined,
): string | null {
  const num = Number(price);
  const isValid =
    price != null && price !== "" && !Number.isNaN(num) && num > 0;

  return isValid
    ? `${prefix} ${Number.isInteger(num) ? String(num) : String(Math.round(num))} kr`
    : null;
}

export const mapFeedItemToDiscoverItem = (
  item: FeedContentItem,
): DiscoverContentItem => {
  const isFree = item.accessType === ACCESS_TYPE_FREE;

  const paidActions = [
    formatPriceLabel(RENT_PREFIX, item.rentPrice),
    formatPriceLabel(BUY_PREFIX, item.buyPrice),
  ]
    .filter(Boolean)
    .map((label) => ({ labelKey: label as string }));

  const freeAction = { labelKey: FREE_LABEL, fullWidth: true };

  const actions =
    isFree || paidActions.length === 0
      ? [freeAction]
      : paidActions.map((act) => ({
          ...act,
          fullWidth: paidActions.length === 1,
        }));

  const mediaType = resolveMediaType(item.contentType);
  const mediaTypeKey =
    mediaType === MEDIA_TYPE.EPUB
      ? MEDIA_TYPE_EPUB_KEY
      : item.contentType || FALLBACK_MEDIA_TYPE_LABEL;

  return {
    id: item.id,
    contentKey: item.id,
    categoryKey: item.categoryName || "",
    image: item.thumbnailUrl || fallbackImage,
    titleKey: item.title,
    authorKey: item.creatorName || "",
    dateKey: item.publishedAgo || "",
    mediaType,
    mediaTypeKey,
    actions,
  };
};

export const discoverContentData: DiscoverContentItem[] = [
  {
    id: 1,
    contentKey: "krollehjerne",
    categoryKey: "discoverContent.items.1.category",
    image: imageTwo,
    titleKey: "discoverContent.items.1.title",
    authorKey: "discoverContent.items.1.author",
    dateKey: "discoverContent.items.1.date",
    mediaType: "video",
    mediaTypeKey: "discoverContent.mediaTypes.video",
    actions: [
      { labelKey: "discoverContent.items.1.actions.rent" },
      { labelKey: "discoverContent.items.1.actions.buy" },
    ],
  },
  {
    id: 2,
    contentKey: "tech-talks",
    categoryKey: "discoverContent.items.2.category",
    image: imageOne,
    titleKey: "discoverContent.items.2.title",
    authorKey: "discoverContent.items.2.author",
    dateKey: "discoverContent.items.2.date",
    mediaType: "video",
    mediaTypeKey: "discoverContent.mediaTypes.video",
    actions: [
      { labelKey: "discoverContent.items.2.actions.free", fullWidth: true },
    ],
  },
  {
    id: 3,
    contentKey: "vegetable-recipes",
    categoryKey: "discoverContent.items.3.category",
    image: imageThree,
    titleKey: "discoverContent.items.3.title",
    authorKey: "discoverContent.items.3.author",
    dateKey: "discoverContent.items.3.date",
    mediaType: "video",
    mediaTypeKey: "discoverContent.mediaTypes.video",
    actions: [
      {
        labelKey: "discoverContent.items.3.actions.shopCollection",
        fullWidth: true,
      },
    ],
  },
  {
    id: 4,
    contentKey: "add-adhd",
    categoryKey: "discoverContent.items.4.category",
    image: imageFour,
    titleKey: "discoverContent.items.4.title",
    authorKey: "discoverContent.items.4.author",
    dateKey: "discoverContent.items.4.date",
    mediaType: "epub",
    mediaTypeKey: "discoverContent.mediaTypes.epub",
    actions: [
      { labelKey: "discoverContent.items.4.actions.buy", fullWidth: true },
    ],
  },
];
