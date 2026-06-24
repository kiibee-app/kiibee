import React from "react";
import contentFallbackImage from "@/assets/images/single-tutorial/Content image.png";
import playIcon from "@/assets/images/single-tutorial/Play.svg";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import type { SingleContentPageProps } from "@/types/contentTypes";
import type { ImageSource } from "@/utils/Constants";
import { JAVASCRIPT_TYPE } from "@/utils/collection";
import { toTrimmedString } from "@/utils/Constants";
import { formatDateUSShort } from "@/utils/formatDate";
import {
  type ContentType,
  getContentTypeLabel,
  normalizeContentTypeValue,
} from "@/utils/content";
import {
  resolveCloudflareStreamPlaybackUrl,
  resolveContentThumbnailCandidates,
} from "@/utils/media";
import {
  getContentDetailPricingActions,
  isFreeContentItem,
} from "@/utils/contentPricingActions";
import { FORMAT_TYPE } from "@/utils/types";
import { URL_PROTOCOL_REGEX, isValidUrl } from "@/utils/common";

type Translate = (key: string) => string;
type UnknownRecord = Record<string, unknown>;

export const CONTENT_RESPONSE_KEYS = {
  DATA: "data",
  ID: "id",
  TITLE: "title",
  DESCRIPTION: "description",
  CONTENT_TYPE_ID: "contentTypeId",
  CONTENT_TYPE: "contentType",
  FILE_KEY: "fileKey",
  CONTENT_URL: "contentUrl",
  THUMBNAIL_URL: "thumbnailUrl",
  THUMBNAIL_LANDSCAPE_URL: "thumbnailLandscapeUrl",
  TRAILER_URL: "trailerUrl",
  VISIBILITY: "visibility",
  ACCESS_TYPE: "accessType",
  BUY_PRICE: "buyPrice",
  RENT_PRICE: "rentPrice",
  RENT_DURATION_HOURS: "rentDurationHours",
  DURATION: "duration",
  CREATED_AT: "createdAt",
  CATEGORIES: "categories",
  NAME: "name",
  CREATOR_ID: "creatorId",
  PUBLISHED_YEAR: "publishedYear",
  PRODUCTION_COMPANY: "production_company",
  MANUFACTURER_LINK: "manufacturerLink",
} as const;

export const CONTENT_MEDIA_RESPONSE_KEYS = {
  URL: "url",
} as const;

export const CONTENT_MEDIA_QUERY_KEYS = {
  KEY: "key",
} as const;

export const CONTENT_TRANSLATION_KEYS = {
  notFound: "singleContent.notFound",
  loading: "singleContent.loading",
  imageAlt: "singleContent.imageAlt",
  seeContent: "singleContent.seeContent",
  playTrailer: "singleContent.playTrailer",
  editSuccess: "contents.contentUploadModal.updateSuccess",
  updateError: "contents.contentUploadModal.updateError",
  updateAction: "contents.contentUploadModal.details.update",
  addAction: "contents.contentUploadModal.details.add",
  share: "common.share",
  meta: {
    publishedYear: "singleContent.meta.publishedYear",
    createdAt: "singleContent.meta.createdAt",
    accessType: "singleContent.meta.accessType",
    visibility: "singleContent.meta.visibility",
    duration: "singleContent.meta.duration",
    category: "singleContent.meta.category",
    productionCompany: "singleContent.meta.productionCompany",
    manufacturerLink: "singleContent.meta.manufacturerLink",
  },
} as const;

export type ContentDetailItem = {
  [CONTENT_RESPONSE_KEYS.ID]?: string;
  [CONTENT_RESPONSE_KEYS.TITLE]?: string;
  [CONTENT_RESPONSE_KEYS.DESCRIPTION]?: string | null;
  [CONTENT_RESPONSE_KEYS.CONTENT_TYPE_ID]?: string | null;
  [CONTENT_RESPONSE_KEYS.CONTENT_TYPE]?: string | null;
  [CONTENT_RESPONSE_KEYS.FILE_KEY]?: string | null;
  [CONTENT_RESPONSE_KEYS.CONTENT_URL]?: string | null;
  [CONTENT_RESPONSE_KEYS.THUMBNAIL_URL]?: string | null;
  [CONTENT_RESPONSE_KEYS.THUMBNAIL_LANDSCAPE_URL]?: string | null;
  [CONTENT_RESPONSE_KEYS.TRAILER_URL]?: string | null;
  [CONTENT_RESPONSE_KEYS.VISIBILITY]?: string | null;
  [CONTENT_RESPONSE_KEYS.ACCESS_TYPE]?: string | null;
  [CONTENT_RESPONSE_KEYS.BUY_PRICE]?: string | number | null;
  [CONTENT_RESPONSE_KEYS.RENT_PRICE]?: string | number | null;
  [CONTENT_RESPONSE_KEYS.RENT_DURATION_HOURS]?: string | number | null;
  [CONTENT_RESPONSE_KEYS.DURATION]?: number | null;
  [CONTENT_RESPONSE_KEYS.CREATED_AT]?: string | null;
  [CONTENT_RESPONSE_KEYS.CATEGORIES]?: { id?: string; name?: string }[];
  accessInfo?: {
    accessType?: string;
    rentExpiresAt?: string | null;
    grantedAt?: string | null;
    timeLeftText?: string;
  } | null;
  [CONTENT_RESPONSE_KEYS.CREATOR_ID]?: string | null;
  [CONTENT_RESPONSE_KEYS.PUBLISHED_YEAR]?: number | null;
  [CONTENT_RESPONSE_KEYS.PRODUCTION_COMPANY]?: string | null;
  [CONTENT_RESPONSE_KEYS.MANUFACTURER_LINK]?: string | null;
};

export type ContentMediaUrlResponse = {
  [CONTENT_MEDIA_RESPONSE_KEYS.URL]?: string;
  iframeUrl?: string;
  streamUrl?: string;
  token?: string;
};

export type ContentDetailResponse =
  | ContentDetailItem
  | {
      [CONTENT_RESPONSE_KEYS.DATA]?: ContentDetailItem;
    };

const asRecord = (value: unknown): UnknownRecord | undefined =>
  value && typeof value === JAVASCRIPT_TYPE.OBJECT
    ? (value as UnknownRecord)
    : undefined;

export const getContentDetail = (
  response: ContentDetailResponse | undefined,
): ContentDetailItem | undefined => {
  if (!response) return undefined;
  const record = asRecord(response);
  const data = record?.[CONTENT_RESPONSE_KEYS.DATA];
  return (asRecord(data) ?? record) as ContentDetailItem;
};

export const normalizeContentType = (value?: string | null): ContentType => {
  return normalizeContentTypeValue(value);
};

export const getContentType = (content?: ContentDetailItem) =>
  normalizeContentType(
    content?.[CONTENT_RESPONSE_KEYS.CONTENT_TYPE] ??
      content?.[CONTENT_RESPONSE_KEYS.CONTENT_TYPE_ID],
  );

export const getContentMediaKey = (content?: ContentDetailItem) =>
  toTrimmedString(content?.[CONTENT_RESPONSE_KEYS.FILE_KEY]);

export const getContentUrl = (content?: ContentDetailItem) =>
  toTrimmedString(content?.[CONTENT_RESPONSE_KEYS.CONTENT_URL]);

export const hasDirectPlaybackUrl = (url?: string | null) =>
  Boolean(url && URL_PROTOCOL_REGEX.test(url));

export const resolveContentPlaybackUrl = (
  content: ContentDetailItem | undefined,
  signedUrl?: string,
): string => {
  const contentType = getContentType(content);
  const contentUrl = getContentUrl(content);
  const fileKey = getContentMediaKey(content);

  if (contentType === FORMAT_TYPE.WEB) {
    return contentUrl;
  }

  if (signedUrl) {
    return signedUrl;
  }

  const cloudflareEmbedUrl = resolveCloudflareStreamPlaybackUrl(
    fileKey,
    contentUrl,
  );

  if (cloudflareEmbedUrl) {
    return cloudflareEmbedUrl;
  }

  if (hasDirectPlaybackUrl(contentUrl)) {
    return contentUrl;
  }

  return "";
};

const getContentHeroImages = (
  content: ContentDetailItem,
): { image: ImageSource; imageFallback?: string } => {
  const candidates = resolveContentThumbnailCandidates(
    content[CONTENT_RESPONSE_KEYS.THUMBNAIL_URL],
    content[CONTENT_RESPONSE_KEYS.THUMBNAIL_LANDSCAPE_URL],
    { preferLandscape: true },
  );

  return {
    image: candidates[0] ?? contentFallbackImage,
    ...(candidates[1] ? { imageFallback: candidates[1] } : {}),
  };
};

const getCategoryNames = (content: ContentDetailItem) =>
  (content[CONTENT_RESPONSE_KEYS.CATEGORIES] ?? [])
    .map((category) => toTrimmedString(category.name))
    .filter(Boolean);

export const getSingleContentProps = (
  content: ContentDetailItem,
  t: Translate,
  mediaUrl?: string,
  options?: { inCollection?: boolean; viewerId?: string },
): SingleContentPageProps => {
  const title =
    toTrimmedString(content[CONTENT_RESPONSE_KEYS.TITLE]) ||
    t(CONTENT_TRANSLATION_KEYS.imageAlt);
  const description = toTrimmedString(
    content[CONTENT_RESPONSE_KEYS.DESCRIPTION],
  );
  const contentType = getContentType(content);
  const categories = getCategoryNames(content);
  const mainCategory = categories[0];
  const createdAt = formatDateUSShort(
    content[CONTENT_RESPONSE_KEYS.CREATED_AT] ?? undefined,
  );
  const accessType = toTrimmedString(
    content[CONTENT_RESPONSE_KEYS.ACCESS_TYPE],
  );
  const visibility = toTrimmedString(content[CONTENT_RESPONSE_KEYS.VISIBILITY]);
  const buyPrice = content[CONTENT_RESPONSE_KEYS.BUY_PRICE];
  const rentPrice = content[CONTENT_RESPONSE_KEYS.RENT_PRICE];
  const rentDurationHours = content[CONTENT_RESPONSE_KEYS.RENT_DURATION_HOURS];
  const pricingItem = { accessType, buyPrice, rentPrice, rentDurationHours };
  const isFree = isFreeContentItem(pricingItem);
  const hasViewerAccess = Boolean(content.accessInfo);
  const pricingActions = getContentDetailPricingActions(pricingItem, t, {
    inCollection: options?.inCollection,
  });

  const trailerUrl = toTrimmedString(
    content[CONTENT_RESPONSE_KEYS.TRAILER_URL],
  );

  const isVideo = contentType === FORMAT_TYPE.VIDEO;
  const showTrailerInHero = Boolean(trailerUrl);
  const isOwner = Boolean(
    options?.viewerId &&
    content[CONTENT_RESPONSE_KEYS.CREATOR_ID] === options.viewerId,
  );

  const productionCompany = toTrimmedString(
    content[CONTENT_RESPONSE_KEYS.PRODUCTION_COMPANY],
  );
  const manufacturerLink = toTrimmedString(
    content[CONTENT_RESPONSE_KEYS.MANUFACTURER_LINK],
  );

  return {
    contentId: toTrimmedString(content[CONTENT_RESPONSE_KEYS.ID]),
    title,
    descriptions: description ? [description] : [],
    tags: categories,
    statusLabel: visibility,
    hero: {
      ...getContentHeroImages(content),
      imageAlt: title,
      contentType,
      ...(showTrailerInHero && trailerUrl
        ? {
            media: {
              type: FORMAT_TYPE.VIDEO,
              src: trailerUrl,
              title,
            },
            contentUrl: mediaUrl,
          }
        : mediaUrl && !isVideo
          ? {
              media: {
                type: contentType,
                src: mediaUrl,
                title,
              },
            }
          : isVideo && mediaUrl
            ? { contentUrl: mediaUrl }
            : {}),
      categoryLabel: categories[0],
      mediaLabel: getContentTypeLabel(contentType),
      ...(isVideo || showTrailerInHero
        ? {
            mediaIcon: playCircleIcon,
            mediaIconAlt: t(CONTENT_TRANSLATION_KEYS.seeContent),
            trailerLabel: t(CONTENT_TRANSLATION_KEYS.playTrailer),
            trailerIcon: playIcon,
            trailerIconAlt: t(CONTENT_TRANSLATION_KEYS.playTrailer),
          }
        : {}),
    },
    ...(isFree || hasViewerAccess || isOwner
      ? {
          primaryAction: {
            label: t(CONTENT_TRANSLATION_KEYS.seeContent),
          },
        }
      : {
          primaryActions: pricingActions.map((action) => ({
            label: action.label,
            subtitle: action.subtitle,
            variant: action.variant,
          })),
        }),
    metaItems: [
      mainCategory
        ? {
            label: t(CONTENT_TRANSLATION_KEYS.meta.category),
            value: mainCategory,
          }
        : undefined,
      content[CONTENT_RESPONSE_KEYS.PUBLISHED_YEAR]
        ? {
            label: t(CONTENT_TRANSLATION_KEYS.meta.publishedYear),
            value: String(content[CONTENT_RESPONSE_KEYS.PUBLISHED_YEAR]),
          }
        : undefined,
      createdAt
        ? {
            label: t(CONTENT_TRANSLATION_KEYS.meta.createdAt),
            value: createdAt,
          }
        : undefined,
      accessType
        ? {
            label: t(CONTENT_TRANSLATION_KEYS.meta.accessType),
            value: accessType,
          }
        : undefined,
      visibility
        ? {
            label: t(CONTENT_TRANSLATION_KEYS.meta.visibility),
            value: visibility,
          }
        : undefined,
      content[CONTENT_RESPONSE_KEYS.DURATION]
        ? {
            label: t(CONTENT_TRANSLATION_KEYS.meta.duration),
            value: `${content[CONTENT_RESPONSE_KEYS.DURATION]} min`,
          }
        : undefined,
      productionCompany
        ? {
            label: t(CONTENT_TRANSLATION_KEYS.meta.productionCompany),
            value: productionCompany,
          }
        : undefined,
      isValidUrl(manufacturerLink)
        ? {
            label: t(CONTENT_TRANSLATION_KEYS.meta.manufacturerLink),
            value: React.createElement(
              "a",
              {
                href: manufacturerLink,
                target: "_blank",
                rel: "noopener noreferrer",
              },
              manufacturerLink,
            ),
          }
        : undefined,
    ].filter(Boolean) as NonNullable<SingleContentPageProps["metaItems"]>,
    shareLabel: t(CONTENT_TRANSLATION_KEYS.share),
  };
};
