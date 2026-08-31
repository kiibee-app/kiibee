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
import { CONTENTS } from "./translationKeys";
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
  CONTENT_QTY: "contentQty",
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

export const NORMALIZED_VISIBILITY = {
  PUBLIC: "public",
  HIDDEN: "hidden",
  PRIVATE: "private",
  DRAFT: "draft",
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
  [NORMALIZED_VISIBILITY.DRAFT]: COLLECTION_CONTENT_VISIBILITY.DRAFT,
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

export const UPLOAD_KIND = {
  COLLECTION: "collection",
  SINGLE_CONTENT: "single-content",
} as const;

export type UploadKind = (typeof UPLOAD_KIND)[keyof typeof UPLOAD_KIND];

export const UPLOAD_KIND_MODAL = {
  WIDTH: "520px",
  PADDING: "36px 32px 32px",
  BORDER_RADIUS: "20px",
  ICON_SIZE: 24,
} as const;

export const UPLOAD_KIND_ORDER: UploadKind[] = [
  UPLOAD_KIND.COLLECTION,
  UPLOAD_KIND.SINGLE_CONTENT,
];

export const UPLOAD_KIND_I18N = {
  title: CONTENTS.uploadKindModal.title,
  subtitle: CONTENTS.uploadKindModal.subtitle,
  continue: CONTENTS.uploadKindModal.continue,
  options: {
    [UPLOAD_KIND.COLLECTION]: {
      label: CONTENTS.uploadKindModal.options.collection,
      hint: CONTENTS.uploadKindModal.options.collectionHint,
    },
    [UPLOAD_KIND.SINGLE_CONTENT]: {
      label: CONTENTS.uploadKindModal.options.singleContent,
      hint: CONTENTS.uploadKindModal.options.singleContentHint,
    },
  },
} as const;

export const COLLECTION_NAME_ALREADY_EXISTS = "already exists";

export const SINGLE_CONTENT_COLLECTION_NAME = "Single content";

export function getCollectionApiErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return err?.response?.data?.message || err?.message || "";
}

export function isCollectionNameExistsError(message: string): boolean {
  return message.toLowerCase().includes(COLLECTION_NAME_ALREADY_EXISTS);
}

const SINGLE_CONTENT_COLLECTION_ALIASES = new Set([
  SINGLE_CONTENT_COLLECTION_NAME.toLowerCase(),
  "enkelt indhold",
]);

export function isSingleContentCollectionName(
  name: string,
  localizedName?: string,
): boolean {
  const normalized = name.trim().toLowerCase();
  if (SINGLE_CONTENT_COLLECTION_ALIASES.has(normalized)) {
    return true;
  }

  const localizedNormalized = localizedName?.trim().toLowerCase();
  return Boolean(localizedNormalized) && normalized === localizedNormalized;
}

export function findSingleContentCollection<T extends { name: string }>(
  collections: T[],
  localizedName?: string,
): T | undefined {
  return collections.find((collection) =>
    isSingleContentCollectionName(collection.name, localizedName),
  );
}
