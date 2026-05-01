import React from "react";
import COLORS from "@repo/ui/colors";
import { EpubIcon, PdfIcon, VideoIcon, WebIcon } from "@/assets/icons";

export type CollectionRow = {
  id: string;
  name: string;
  contentsCount: number;
  createdAt: string;
  actions: string;
};

export type CollectionContentType = "pdf" | "video" | "epub" | "web";

export type CollectionContentRow = {
  id: string;
  name: string;
  visibility: "Hidden" | "Public";
  createdAt: string;
  contentType: CollectionContentType;
  actions: string;
};

export type CollectionsTableProps = {
  data: CollectionRow[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMore?: (id: string) => void;
  onRowClick?: (row: CollectionRow) => void;
};

export const collectionsData: CollectionRow[] = [
  {
    id: "1",
    name: "Health Conscious",
    contentsCount: 12,
    createdAt: "August 9, 2019",
    actions: "",
  },
  {
    id: "2",
    name: "Instructional videos",
    contentsCount: 8,
    createdAt: "August 15, 2019",
    actions: "",
  },
  {
    id: "3",
    name: "Audio files and Podcasts",
    contentsCount: 16,
    createdAt: "July 3, 2019",
    actions: "",
  },
  {
    id: "4",
    name: "Other contents",
    contentsCount: 5,
    createdAt: "November 27, 2019",
    actions: "",
  },
  {
    id: "5",
    name: "Books of Psychology",
    contentsCount: 8,
    createdAt: "August 27, 2019",
    actions: "",
  },
  {
    id: "6",
    name: "Important web pages",
    contentsCount: 23,
    createdAt: "October 28, 2025",
    actions: "",
  },
];

const sharedCollectionContents: CollectionContentRow[] = [
  {
    id: "1",
    name: "Medical Journals.pdf",
    visibility: "Hidden",
    createdAt: "August 9, 2019",
    contentType: "pdf",
    actions: "",
  },
  {
    id: "2",
    name: "Exercise Guide.mp4",
    visibility: "Public",
    createdAt: "August 15, 2019",
    contentType: "video",
    actions: "",
  },
  {
    id: "3",
    name: "Fitness Tips.mp4",
    visibility: "Public",
    createdAt: "July 3, 2019",
    contentType: "video",
    actions: "",
  },
  {
    id: "4",
    name: "Healthy Recipes.epub",
    visibility: "Public",
    createdAt: "November 27, 2019",
    contentType: "epub",
    actions: "",
  },
  {
    id: "5",
    name: "Nutrition.web",
    visibility: "Hidden",
    createdAt: "August 27, 2019",
    contentType: "web",
    actions: "",
  },
  {
    id: "6",
    name: "Wellness Studies.pdf",
    visibility: "Hidden",
    createdAt: "October 28, 2025",
    contentType: "pdf",
    actions: "",
  },
];

export const collectionContentsData: Record<string, CollectionContentRow[]> = {
  "1": sharedCollectionContents,
  "2": sharedCollectionContents,
  "3": sharedCollectionContents,
  "4": sharedCollectionContents,
  "5": sharedCollectionContents,
  "6": sharedCollectionContents,
};

export function getCollectionContentIcon(
  contentType: CollectionContentType,
  size = 20,
) {
  const iconColor = COLORS.neutral.BLACK;

  switch (contentType) {
    case "pdf":
      return React.createElement(PdfIcon, {
        width: size,
        height: size,
        color: iconColor,
      });
    case "video":
      return React.createElement(VideoIcon, {
        width: size,
        height: size,
        color: iconColor,
      });
    case "epub":
      return React.createElement(EpubIcon, {
        width: size,
        height: size,
        color: iconColor,
      });
    case "web":
      return React.createElement(WebIcon, {
        width: size,
        height: size,
        color: iconColor,
      });
    default:
      return React.createElement(PdfIcon, {
        width: size,
        height: size,
        color: iconColor,
      });
  }
}

export const NAME = "name";
export const VISIBILITY = "visibility";
