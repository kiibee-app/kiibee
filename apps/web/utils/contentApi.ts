import contentFallbackImage from "@/assets/images/single-tutorial/Content image.png";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import type { CollectionContentType } from "@/types/collectionsType";
import type { SingleContentPageProps } from "@/types/contentTypes";
import type { ImageSource } from "@/utils/Constants";
import {
  CONTENT_TYPE_BY_API_VALUE,
  DEFAULT_COLLECTION_CONTENT_TYPE,
  JAVASCRIPT_TYPE,
} from "@/utils/collection";
import { toTrimmedString } from "@/utils/Constants";
import { formatDateUSShort } from "@/utils/formatDate";
import { FORMAT_TYPE } from "@/utils/types";

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
  VISIBILITY: "visibility",
  ACCESS_TYPE: "accessType",
  CREATED_AT: "createdAt",
  CATEGORIES: "categories",
  NAME: "name",
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
  editSuccess: "contents.contentUploadModal.updateSuccess",
  updateError: "contents.contentUploadModal.updateError",
  updateAction: "contents.contentUploadModal.details.update",
  addAction: "contents.contentUploadModal.details.add",
  share: "common.share",
  meta: {
    createdAt: "singleContent.meta.createdAt",
    accessType: "singleContent.meta.accessType",
    visibility: "singleContent.meta.visibility",
  },
} as const;

export const CONTENT_UPLOAD_MODE = {
  CREATE: "create",
  EDIT: "edit",
} as const;

export const CONTENT_MODAL_KEY_FALLBACK = "create-content";

export type ContentUploadMode =
  (typeof CONTENT_UPLOAD_MODE)[keyof typeof CONTENT_UPLOAD_MODE];

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
  [CONTENT_RESPONSE_KEYS.VISIBILITY]?: string | null;
  [CONTENT_RESPONSE_KEYS.ACCESS_TYPE]?: string | null;
  [CONTENT_RESPONSE_KEYS.CREATED_AT]?: string | null;
  [CONTENT_RESPONSE_KEYS.CATEGORIES]?: { id?: string; name?: string }[];
};

export type ContentMediaUrlResponse = {
  [CONTENT_MEDIA_RESPONSE_KEYS.URL]?: string;
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

export const normalizeContentType = (
  value?: string | null,
): CollectionContentType => {
  const normalized = toTrimmedString(value).toLowerCase().replace(/\s+/g, "-");
  return (
    CONTENT_TYPE_BY_API_VALUE[normalized] ?? DEFAULT_COLLECTION_CONTENT_TYPE
  );
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

const getContentImage = (content: ContentDetailItem): ImageSource =>
  toTrimmedString(
    content[CONTENT_RESPONSE_KEYS.THUMBNAIL_LANDSCAPE_URL] ??
      content[CONTENT_RESPONSE_KEYS.THUMBNAIL_URL],
  ) || contentFallbackImage;

const getContentTypeLabel = (contentType: CollectionContentType) =>
  contentType.toUpperCase();

const getCategoryNames = (content: ContentDetailItem) =>
  (content[CONTENT_RESPONSE_KEYS.CATEGORIES] ?? [])
    .map((category) => toTrimmedString(category.name))
    .filter(Boolean);

export const getSingleContentProps = (
  content: ContentDetailItem,
  t: Translate,
  mediaUrl?: string,
): SingleContentPageProps => {
  const title =
    toTrimmedString(content[CONTENT_RESPONSE_KEYS.TITLE]) ||
    t(CONTENT_TRANSLATION_KEYS.imageAlt);
  const description = toTrimmedString(
    content[CONTENT_RESPONSE_KEYS.DESCRIPTION],
  );
  const contentType = getContentType(content);
  const categories = getCategoryNames(content);
  const createdAt = formatDateUSShort(
    content[CONTENT_RESPONSE_KEYS.CREATED_AT] ?? undefined,
  );
  const accessType = toTrimmedString(
    content[CONTENT_RESPONSE_KEYS.ACCESS_TYPE],
  );
  const visibility = toTrimmedString(content[CONTENT_RESPONSE_KEYS.VISIBILITY]);

  return {
    title,
    descriptions: description ? [description] : [],
    tags: categories,
    statusLabel: visibility,
    hero: {
      image: getContentImage(content),
      imageAlt: title,
      ...(mediaUrl
        ? {
            media: {
              type: contentType,
              src: mediaUrl,
              title,
            },
          }
        : {}),
      categoryLabel: categories[0],
      mediaLabel: getContentTypeLabel(contentType),
      ...(contentType === FORMAT_TYPE.VIDEO
        ? {
            mediaIcon: playCircleIcon,
            mediaIconAlt: t(CONTENT_TRANSLATION_KEYS.seeContent),
          }
        : {}),
    },
    primaryAction: {
      label: t(CONTENT_TRANSLATION_KEYS.seeContent),
    },
    metaItems: [
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
    ].filter(Boolean) as NonNullable<SingleContentPageProps["metaItems"]>,
    shareLabel: t(CONTENT_TRANSLATION_KEYS.share),
  };
};
