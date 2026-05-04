import { CollectionContentRow, CollectionRow } from "@/types/collectionsType";

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
