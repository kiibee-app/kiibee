import React from "react";
import COLORS from "@repo/ui/colors";
import { EpubIcon, PdfIcon, VideoIcon, WebIcon } from "@/assets/icons";
import { CollectionContentType } from "@/types/collectionsType";
import { IconComponent } from "./content";

const ICON_MAP: Record<CollectionContentType, IconComponent> = {
  pdf: PdfIcon,
  video: VideoIcon,
  epub: EpubIcon,
  web: WebIcon,
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
