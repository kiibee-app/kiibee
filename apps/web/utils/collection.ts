import React from "react";
import COLORS from "@repo/ui/colors";
import {
  AudioIcon,
  EpubIcon,
  PdfIcon,
  VideoIcon,
  WebIcon,
} from "@/assets/icons";
import type {
  CollectionContentRow,
  CollectionContentType,
} from "@/types/collectionsType";
import type { IconComponent } from "./content";
import { FORMAT_TYPE } from "./types";

export const RESPONSE_KEYS = {
  DATA: "data",
  ITEMS: "items",
  COLLECTIONS: "collections",
  CONTENTS: "contents",
} as const;

export const API_FIELD_KEYS = {
  ID: "id",
  NAME: "name",
  TITLE: "title",
  DESCRIPTION: "description",
  CONTENTS_COUNT: "contentsCount",
  CREATED_AT: "createdAt",
  VISIBILITY: "visibility",
  CONTENT_TYPE: "contentType",
  CONTENT_TYPE_NAME: "contentTypeName",
} as const;

export const JAVASCRIPT_TYPE = {
  OBJECT: "object",
} as const;

export type CollectionContentVisibility =
  CollectionContentRow[typeof API_FIELD_KEYS.VISIBILITY];

export const API_CONTENT_TYPE = {
  ...FORMAT_TYPE,
  WEB_LINK: "web-link",
} as const;

export const CONTENT_TYPE_BY_API_VALUE: Record<string, CollectionContentType> =
  {
    [API_CONTENT_TYPE.VIDEO]: FORMAT_TYPE.VIDEO,
    [API_CONTENT_TYPE.AUDIO]: FORMAT_TYPE.AUDIO,
    [API_CONTENT_TYPE.PDF]: FORMAT_TYPE.PDF,
    [API_CONTENT_TYPE.EPUB]: FORMAT_TYPE.EPUB,
    [API_CONTENT_TYPE.WEB]: FORMAT_TYPE.WEB,
    [API_CONTENT_TYPE.WEB_LINK]: FORMAT_TYPE.WEB,
  };

export const DEFAULT_COLLECTION_CONTENT_TYPE = FORMAT_TYPE.PDF;

export const NORMALIZED_VISIBILITY = {
  PUBLIC: "public",
  HIDDEN: "hidden",
  PRIVATE: "private",
} as const;

export const COLLECTION_CONTENT_VISIBILITY = {
  PUBLIC: "Public",
  HIDDEN: "Hidden",
  PRIVATE: "Private",
  DRAFT: "Draft",
} as const satisfies Record<string, CollectionContentVisibility>;

export const VISIBILITY_BY_API_VALUE: Record<
  string,
  CollectionContentVisibility
> = {
  [NORMALIZED_VISIBILITY.PUBLIC]: COLLECTION_CONTENT_VISIBILITY.PUBLIC,
  [NORMALIZED_VISIBILITY.HIDDEN]: COLLECTION_CONTENT_VISIBILITY.HIDDEN,
  [NORMALIZED_VISIBILITY.PRIVATE]: COLLECTION_CONTENT_VISIBILITY.PRIVATE,
};

export const DEFAULT_COLLECTION_CONTENT_VISIBILITY =
  COLLECTION_CONTENT_VISIBILITY.DRAFT;

const ICON_MAP: Record<CollectionContentType, IconComponent> = {
  [FORMAT_TYPE.PDF]: PdfIcon,
  [FORMAT_TYPE.VIDEO]: VideoIcon,
  [FORMAT_TYPE.AUDIO]: AudioIcon,
  [FORMAT_TYPE.EPUB]: EpubIcon,
  [FORMAT_TYPE.WEB]: WebIcon,
};

export function getCollectionContentIcon(
  type: CollectionContentType,
  size = 20,
) {
  const Icon = ICON_MAP[type] ?? PdfIcon;

  return React.createElement(Icon, {
    width: size,
    height: size,
    color: COLORS.neutral.BLACK,
  });
}

export const COLLECTION_TABLE_TYPE = {
  COLLECTIONS: "collections",
  CONTENTS: "contents",
} as const;

export type CollectionTableType =
  (typeof COLLECTION_TABLE_TYPE)[keyof typeof COLLECTION_TABLE_TYPE];
