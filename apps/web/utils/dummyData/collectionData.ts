import { CollectionContentRow, CollectionRow } from "@/types/collectionsType";
import design1 from "@/assets/images/design1.webp";
import design2 from "@/assets/images/design2.webp";
import design3 from "@/assets/images/design.webp";
import design4 from "@/assets/images/crafts.png";
import design5 from "@/assets/images/flower.png";
import { PurchasedCollectionItem } from "./viewerPurchasedMockData";
import { FORMAT_TYPE } from "../types";

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

export const COLLECTIONS_FOR_PAGE: PurchasedCollectionItem[] = [
  {
    id: "c1",
    title: "Asian recipes",
    author: "creatorName",
    elementCount: 10,
    coverSrc: design1.src,
    hideBadge: true,
    actions: [
      {
        label: "Buy xx kr",
        sublabel: "Instant access",
        variant: "primary",
      },
    ],
  },
  {
    id: "c2",
    title: "Winter soups",
    author: "creatorName",
    elementCount: 13,
    coverSrc: design2.src,
    hideBadge: true,
    actions: [
      {
        label: "See content",
        sublabel: "Already owned",
        variant: "primary",
      },
    ],
  },
  {
    id: "c3",
    title: "Mexican dishes",
    author: "creatorName",
    elementCount: 22,
    coverSrc: design3.src,
    hideBadge: true,
    actions: [
      {
        label: "Buy xx kr",
        sublabel: "Instant access",
        variant: "primary",
      },
      {
        label: "Rent xx kr",
        sublabel: "24h access",
        variant: "secondary",
      },
    ],
  },
  {
    id: "c4",
    title: "Salads",
    author: "creatorName",
    elementCount: 23,
    coverSrc: design1.src,
    hideBadge: true,
    actions: [
      {
        label: "Rent xx kr",
        sublabel: "24h access",
        variant: "secondary",
      },
    ],
  },
];

export const ABOUT_VIDEO_OVERRIDES = [
  {
    title: "Floating flowers",
    creator: "Nana Jacobson",
    published: "9 months ago",
    category: "Design",
    image: design5,
  },
  {
    title: "Deer",
    creator: "Nana Jacobson",
    published: "4 days ago",
    category: "Design",
    image: design4,
  },
  {
    title: "Cactus",
    creator: "Nana Jacobson",
    published: "1 year ago",
    category: "Educational",
    image: design5,
  },
  {
    title: "Easter bunnies",
    creator: "Nana Jacobson",
    published: "9 days ago",
    category: "Design",
    image: design4,
  },
] as const;

export const CLOTHES_DATA = [
  {
    title: "Colorful sweater",
    creator: "Nana Jacobson",
    published: "9 months ago",
    category: "Design",
    image: design1,
    formatLabel: "Video",
    formatType: FORMAT_TYPE.VIDEO,
    buttons: [
      {
        label: "Free",
        variant: "secondary",
      },
    ],
  },
  {
    title: "Cute jacket",
    creator: "Nana Jacobson",
    published: "4 days ago",
    category: "Design",
    image: design2,
    formatLabel: "PDF",
    formatType: FORMAT_TYPE.PDF,
    buttons: [
      {
        label: "Rent 39 kr",
        variant: "secondary",
      },
      {
        label: "Buy 139 kr",
        variant: "secondary",
      },
    ],
  },
  {
    title: "Mittens and beanie",
    creator: "Nana Jacobson",
    published: "1 year ago",
    category: "Educational",
    image: design3,
    formatLabel: "E-pub",
    formatType: FORMAT_TYPE.EPUB,
    buttons: [
      {
        label: "Buy 49 kr",
        variant: "secondary",
      },
    ],
  },
  {
    title: "Poncho",
    creator: "Nana Jacobson",
    published: "9 days ago",
    category: "Design",
    image: design1,
    formatLabel: "Video",
    formatType: FORMAT_TYPE.VIDEO,
    buttons: [
      {
        label: "Buy 49 kr",
        variant: "secondary",
      },
    ],
  },
] as const;
