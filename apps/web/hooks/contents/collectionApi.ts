import type {
  CollectionContentRow,
  CollectionRow,
} from "@/types/collectionsType";
import type { SetStateAction } from "react";
import {
  ACCESS_TYPE_FREE,
  type CollectionAccessType,
  type CollectionVisibility,
} from "@/utils/Constants";
import { formatDateUSShort } from "@/utils/formatDate";
import {
  API_FIELD_KEYS,
  type CollectionContentVisibility,
  DEFAULT_COLLECTION_CONTENT_VISIBILITY,
  JAVASCRIPT_TYPE,
  RESPONSE_KEYS,
  VISIBILITY_BY_API_VALUE,
} from "@/utils/collection";
import { normalizeContentTypeValue } from "@/utils/content";
import {
  checkHasPriceOrCode,
  getPasswordCount,
} from "@/utils/admissionRequirements";

type UnknownRecord = Record<string, unknown>;
type ApiRecord = UnknownRecord;
const EMPTY_ACTION = "";

export type CollectionsApiItem = {
  [API_FIELD_KEYS.ID]?: string | number;
  creatorId?: string;
  [API_FIELD_KEYS.NAME]?: string;
  [API_FIELD_KEYS.CONTENTS_COUNT]?: number;
  [API_FIELD_KEYS.CONTENT_QTY]?: number;
  [API_FIELD_KEYS.CREATED_AT]?: string;
  accessType?: CollectionAccessType;
  description?: string;
  coverImageUrl?: string;
  visibility?: CollectionVisibility;
  isPublished?: boolean;
  buyPrice?: number | string | null;
  rentPrice?: number | string | null;
  rentDuration?: string | null;
  passwordHash?: string | null;
  hasWarningItem?: boolean;
  has_warning_item?: boolean;
  hasFreeNonWebContent?: boolean;
  has_free_non_web_content?: boolean;
  slug?: string;
};

export type CollectionsApiResponse =
  | CollectionsApiItem[]
  | {
      [RESPONSE_KEYS.DATA]?:
        | CollectionsApiItem[]
        | {
            [RESPONSE_KEYS.ITEMS]?: CollectionsApiItem[];
            [RESPONSE_KEYS.COLLECTIONS]?: CollectionsApiItem[];
          };
      [RESPONSE_KEYS.ITEMS]?: CollectionsApiItem[];
      [RESPONSE_KEYS.COLLECTIONS]?: CollectionsApiItem[];
    };

export type CollectionContentsApiItem = {
  [API_FIELD_KEYS.ID]?: string | number;
  [API_FIELD_KEYS.NAME]?: string;
  [API_FIELD_KEYS.TITLE]?: string;
  [API_FIELD_KEYS.DESCRIPTION]?: string;
  [API_FIELD_KEYS.VISIBILITY]?: string;
  [API_FIELD_KEYS.CONTENT_TYPE]?: string;
  [API_FIELD_KEYS.CONTENT_TYPE_NAME]?: string;
  [API_FIELD_KEYS.CREATED_AT]?: string;
  accessType?: string;
  buyPrice?: number | string | null;
  rentPrice?: number | string | null;
  hasPassword?: boolean;
};

export type CollectionContentsApiResponse =
  | CollectionContentsApiItem[]
  | {
      [RESPONSE_KEYS.DATA]?:
        | CollectionContentsApiItem[]
        | {
            [RESPONSE_KEYS.ITEMS]?: CollectionContentsApiItem[];
            [RESPONSE_KEYS.CONTENTS]?: CollectionContentsApiItem[];
          };
      [RESPONSE_KEYS.ITEMS]?: CollectionContentsApiItem[];
      [RESPONSE_KEYS.CONTENTS]?: CollectionContentsApiItem[];
    };

const asRecord = (value: unknown): UnknownRecord | undefined =>
  value && typeof value === JAVASCRIPT_TYPE.OBJECT
    ? (value as UnknownRecord)
    : undefined;

const getListFromResponse = <T>(
  response: unknown,
  listKeys: readonly string[],
): T[] => {
  const responseRecord = asRecord(response);
  const data = responseRecord?.[RESPONSE_KEYS.DATA];
  const dataRecord = asRecord(data);

  const candidates = [
    response,
    ...listKeys.map((key) => responseRecord?.[key]),
    data,
    ...listKeys.map((key) => dataRecord?.[key]),
  ];

  const list = candidates.find(Array.isArray);
  return (list as T[] | undefined) ?? [];
};

const getCollectionList = (
  response: CollectionsApiResponse,
): CollectionsApiItem[] => {
  return getListFromResponse<CollectionsApiItem>(response, [
    RESPONSE_KEYS.ITEMS,
    RESPONSE_KEYS.COLLECTIONS,
  ]);
};

const getCollectionContentList = (
  response: CollectionContentsApiResponse,
): CollectionContentRow[] => {
  return getListFromResponse<CollectionContentRow>(response, [
    RESPONSE_KEYS.ITEMS,
    RESPONSE_KEYS.CONTENTS,
  ]);
};

const normalizeCollectionContentVisibility = (
  value?: string,
): CollectionContentVisibility => {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return DEFAULT_COLLECTION_CONTENT_VISIBILITY;

  return (
    VISIBILITY_BY_API_VALUE[normalized] ?? DEFAULT_COLLECTION_CONTENT_VISIBILITY
  );
};

const pick = (item: ApiRecord, ...keys: string[]): unknown =>
  keys.map((key) => item[key]).find((value) => value != null);

const toText = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const toNumberOrNull = (value: unknown): number | null =>
  value == null ? null : Number(value);

const hasText = (value: unknown): boolean =>
  typeof value === "string" && value.trim().length > 0;

const hasPasswordValue = (item: ApiRecord): boolean =>
  Boolean(
    pick(item, "hasPassword", "has_password", "passwordHash", "password_hash"),
  ) ||
  hasText(item.password) ||
  hasText(item.passwords) ||
  (Array.isArray(item.passwords) && item.passwords.length > 0);

const getBuyPrice = (item: ApiRecord) =>
  toNumberOrNull(
    pick(
      item,
      "buyPrice",
      "buy_price",
      "purchaseAmount",
      "purchase_amount",
      "price",
      "amount",
    ),
  );

const getRentPrice = (item: ApiRecord) =>
  toNumberOrNull(
    pick(item, "rentPrice", "rent_price", "rentalAmount", "rental_amount"),
  );

const getAccessType = (item: ApiRecord, isFree: boolean) =>
  toText(
    pick(
      item,
      "accessType",
      "access_type",
      "admissionRequirement",
      "admission_requirement",
    ),
  ) ?? (isFree ? ACCESS_TYPE_FREE : undefined);

const getPasswordSource = (item: ApiRecord) =>
  item.passwordHash || item.password_hash || item.password || item.passwords;

export const getCollectionRows = (
  response: CollectionsApiResponse,
): CollectionRow[] => {
  return getCollectionList(response)
    .filter(
      (item) => item[API_FIELD_KEYS.ID] != null && item[API_FIELD_KEYS.NAME],
    )
    .map((apiItem): CollectionRow => {
      const item: ApiRecord = { ...apiItem };
      const isFree = !checkHasPriceOrCode(item);

      return {
        ...apiItem,
        id: String(item[API_FIELD_KEYS.ID]),
        creatorId: toText(pick(item, "creatorId", "creator_id")),
        name: String(item[API_FIELD_KEYS.NAME]),
        contentsCount: Number(
          pick(
            item,
            API_FIELD_KEYS.CONTENTS_COUNT,
            API_FIELD_KEYS.CONTENT_QTY,
            "content_qty",
            "contents_count",
          ) ?? 0,
        ),
        createdAt: formatDateUSShort(toText(item[API_FIELD_KEYS.CREATED_AT])),
        actions: EMPTY_ACTION,
        accessType: getAccessType(item, isFree) as CollectionAccessType,
        description: toText(item.description),
        coverImageUrl: toText(pick(item, "coverImageUrl", "cover_image_url")),
        visibility: item.visibility as CollectionVisibility | undefined,
        isPublished: Boolean(pick(item, "isPublished", "is_published")),
        isFree,
        isPaid: !isFree,
        buyPrice: getBuyPrice(item),
        rentPrice: getRentPrice(item),
        rentDuration:
          toText(
            pick(
              item,
              "rentDuration",
              "rent_duration",
              "accessDuration",
              "access_duration",
            ),
          ) ?? null,
        hasPassword: hasPasswordValue(item),
        passwordCount: getPasswordCount(getPasswordSource(item)),
        hasWarningItem: Boolean(
          pick(
            item,
            "hasWarningItem",
            "has_warning_item",
            "hasFreeNonWebContent",
            "has_free_non_web_content",
          ),
        ),
        slug: toText(item.slug),
      };
    });
};

export const getCollectionContentRows = (
  response: CollectionContentsApiResponse,
): CollectionContentRow[] => {
  return getCollectionContentList(response)
    .filter(
      (item) =>
        item[API_FIELD_KEYS.ID] != null &&
        (item[API_FIELD_KEYS.TITLE] || item[API_FIELD_KEYS.NAME]),
    )
    .map((apiItem): CollectionContentRow => {
      const item: ApiRecord = { ...apiItem };
      const isFree = !checkHasPriceOrCode(item);

      return {
        ...apiItem,
        id: String(item[API_FIELD_KEYS.ID]),
        name: String(pick(item, API_FIELD_KEYS.TITLE, API_FIELD_KEYS.NAME)),
        description: toText(item[API_FIELD_KEYS.DESCRIPTION]),
        visibility: normalizeCollectionContentVisibility(
          toText(item[API_FIELD_KEYS.VISIBILITY]),
        ),
        createdAt: formatDateUSShort(toText(item[API_FIELD_KEYS.CREATED_AT])),
        contentType: normalizeContentTypeValue(
          toText(
            pick(
              item,
              API_FIELD_KEYS.CONTENT_TYPE,
              API_FIELD_KEYS.CONTENT_TYPE_NAME,
            ),
          ),
        ),
        actions: EMPTY_ACTION,
        accessType: getAccessType(item, isFree),
        isFree,
        isPaid: !isFree,
        buyPrice: getBuyPrice(item),
        rentPrice: getRentPrice(item),
        hasPassword: hasPasswordValue(item),
        passwordCount: getPasswordCount(getPasswordSource(item)),
      };
    });
};

export const resolveCollectionsUpdate = (
  updater: SetStateAction<CollectionRow[]>,
  base: CollectionRow[],
) => {
  if (updater instanceof Function) {
    return updater(base);
  }
  return updater;
};
