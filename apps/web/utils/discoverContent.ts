import imageOne from "@/assets/images/discover-content/3545227dd1e7a9cd6faf3b14586708d85137ed35.webp";
import imageTwo from "@/assets/images/discover-content/4ccc137164285071261595311fa290373bc45c72.webp";
import imageThree from "@/assets/images/discover-content/52c1c126e76296e3c8e39b9ac60f6d9a34156583.webp";
import imageFour from "@/assets/images/discover-content/c9051991a79ffc5a50dd15afe7b8c86e09f7faad.webp";
import {
  ImageSource,
  MEDIA_TYPE_EPUB_KEY,
  FALLBACK_MEDIA_TYPE_LABEL,
  resolveMediaType,
  MEDIA_TYPE,
} from "./Constants";
import {
  getContentPricingActions,
  isFreeContentItem,
  resolveContentActionHref,
} from "./contentPricingActions";
import { pathPublishedContent } from "./path";
import { type FeedContentItem } from "./feedContentToTutorial";
import fallbackImage from "@/assets/images/discover-content/3545227dd1e7a9cd6faf3b14586708d85137ed35.webp";

export type DiscoverContentAction = {
  labelKey: string;
  fullWidth?: boolean;
  href?: string;
  requiresAuth?: boolean;
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
  isFree?: boolean;
  actions: DiscoverContentAction[];
};

export { formatPriceLabel } from "./contentPricingActions";

export const mapFeedItemToDiscoverItem = (
  item: FeedContentItem,
): DiscoverContentItem => {
  const pricingActions = getContentPricingActions(item);
  const isFree = isFreeContentItem(item);
  const actions = pricingActions.map((action) => ({
    labelKey: action.label,
    fullWidth: action.fullWidth,
    href: resolveContentActionHref(
      item.id,
      action.label,
      item,
      pricingActions.length,
    ),
    requiresAuth: !isFree,
  }));

  const mediaType = resolveMediaType(item.contentType);
  const mediaTypeKey =
    mediaType === MEDIA_TYPE.EPUB
      ? MEDIA_TYPE_EPUB_KEY
      : item.contentType || FALLBACK_MEDIA_TYPE_LABEL;

  return {
    id: item.id,
    contentKey: item.id,
    isFree: isFreeContentItem(item),
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
      {
        labelKey: "discoverContent.items.1.actions.rent",
        href: `${pathPublishedContent("krollehjerne")}#rent`,
        requiresAuth: true,
      },
      {
        labelKey: "discoverContent.items.1.actions.buy",
        href: `${pathPublishedContent("krollehjerne")}#buy`,
        requiresAuth: true,
      },
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
    isFree: true,
    actions: [
      {
        labelKey: "discoverContent.items.2.actions.free",
        fullWidth: true,
        href: pathPublishedContent("tech-talks"),
      },
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
