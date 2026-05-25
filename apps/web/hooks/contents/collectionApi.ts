import type {
  CollectionContentRow,
  CollectionRow,
} from "@/types/collectionsType";
import type { SetStateAction } from "react";
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

type UnknownRecord = Record<string, unknown>;
const EMPTY_ACTION = "";

export type CollectionsApiItem = {
  [API_FIELD_KEYS.ID]?: string | number;
  [API_FIELD_KEYS.NAME]?: string;
  [API_FIELD_KEYS.CONTENTS_COUNT]?: number;
  [API_FIELD_KEYS.CONTENT_QTY]?: number;
  [API_FIELD_KEYS.CREATED_AT]?: string;
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
): CollectionContentsApiItem[] => {
  return getListFromResponse<CollectionContentsApiItem>(response, [
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

export const getCollectionRows = (
  response: CollectionsApiResponse,
): CollectionRow[] => {
  return getCollectionList(response)
    .filter(
      (item) => item[API_FIELD_KEYS.ID] != null && item[API_FIELD_KEYS.NAME],
    )
    .map((item) => ({
      id: String(item[API_FIELD_KEYS.ID]),
      name: item[API_FIELD_KEYS.NAME] as string,
      contentsCount: Number(
        item[API_FIELD_KEYS.CONTENTS_COUNT] ??
          item[API_FIELD_KEYS.CONTENT_QTY] ??
          0,
      ),
      createdAt: formatDateUSShort(item[API_FIELD_KEYS.CREATED_AT]),
      actions: EMPTY_ACTION,
    }));
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
    .map((item) => ({
      id: String(item[API_FIELD_KEYS.ID]),
      name: (item[API_FIELD_KEYS.TITLE] ?? item[API_FIELD_KEYS.NAME]) as string,
      description: item[API_FIELD_KEYS.DESCRIPTION],
      visibility: normalizeCollectionContentVisibility(
        item[API_FIELD_KEYS.VISIBILITY],
      ),
      createdAt: formatDateUSShort(item[API_FIELD_KEYS.CREATED_AT]),
      contentType: normalizeContentTypeValue(
        item[API_FIELD_KEYS.CONTENT_TYPE] ??
          item[API_FIELD_KEYS.CONTENT_TYPE_NAME],
      ),
      actions: EMPTY_ACTION,
    }));
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
