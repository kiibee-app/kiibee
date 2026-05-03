/**
 * Purchased viewer: mock shapes + sample rows until API wiring.
 * Copy is English-only by design (no i18n); replace with API responses later.
 */

import design1 from "@/assets/images/design1.webp";
import design2 from "@/assets/images/design2.webp";
import design3 from "@/assets/images/design.webp";

/** Bundled asset URLs for Next/Image `src` (string). */
const DESIGN_IMG_1 = design1.src;
const DESIGN_IMG_2 = design2.src;
const DESIGN_IMG_3 = design3.src;

export const PURCHASED_MEDIA_TYPES = {
  VIDEO: "video",
  AUDIO: "audio",
  PDF: "pdf",
} as const;

export type PurchasedMediaType =
  (typeof PURCHASED_MEDIA_TYPES)[keyof typeof PURCHASED_MEDIA_TYPES];

export type PurchasedMediaItem = {
  id: string;
  mediaType: PurchasedMediaType;
  category: string;
  thumbSrc: string;
  title: string;
  author: string;
  dateLabel: string;
};

export type PurchasedCollectionItem = {
  id: string;
  title: string;
  author: string;
  elementCount: number;
  coverSrc: string;
};

export const VIEWER_PURCHASED_PLACEHOLDERS = {
  search: "Search purchased content",
  emptyCollections: "No collections match your search.",
  emptyMedia: "No items match your search.",
} as const;

export const MOCK_PURCHASED_COLLECTIONS: PurchasedCollectionItem[] = [
  {
    id: "c1",
    title: "The Mind's Palette",
    author: "Oliver Smith",
    elementCount: 15,
    coverSrc: DESIGN_IMG_1,
  },
  {
    id: "c2",
    title: "Urban Stories",
    author: "Maya Chen",
    elementCount: 8,
    coverSrc: DESIGN_IMG_2,
  },
];

export const MOCK_PURCHASED_VIDEOS: PurchasedMediaItem[] = [
  {
    id: "v1",
    mediaType: PURCHASED_MEDIA_TYPES.VIDEO,
    category: "Food",
    thumbSrc: DESIGN_IMG_1,
    title: "The Mind's Palette",
    author: "Oliver Smith",
    dateLabel: "5 March 2024",
  },
  {
    id: "v2",
    mediaType: PURCHASED_MEDIA_TYPES.VIDEO,
    category: "Relaxation",
    thumbSrc: DESIGN_IMG_2,
    title: "Evening wind-down",
    author: "Maya Chen",
    dateLabel: "12 February 2024",
  },
  {
    id: "v3",
    mediaType: PURCHASED_MEDIA_TYPES.VIDEO,
    category: "Travel",
    thumbSrc: DESIGN_IMG_3,
    title: "Coastline walk",
    author: "Sam Rivera",
    dateLabel: "3 January 2024",
  },
  {
    id: "v4",
    mediaType: PURCHASED_MEDIA_TYPES.VIDEO,
    category: "Education",
    thumbSrc: DESIGN_IMG_1,
    title: "Systems 101",
    author: "Oliver Smith",
    dateLabel: "20 December 2023",
  },
];

export const MOCK_PURCHASED_AUDIOS: PurchasedMediaItem[] = [
  {
    id: "a1",
    mediaType: PURCHASED_MEDIA_TYPES.AUDIO,
    category: "Food",
    thumbSrc: DESIGN_IMG_2,
    title: "The Mind's Palette",
    author: "Oliver Smith",
    dateLabel: "5 March 2024",
  },
  {
    id: "a2",
    mediaType: PURCHASED_MEDIA_TYPES.AUDIO,
    category: "Education",
    thumbSrc: DESIGN_IMG_3,
    title: "Lecture notes",
    author: "Maya Chen",
    dateLabel: "1 March 2024",
  },
  {
    id: "a3",
    mediaType: PURCHASED_MEDIA_TYPES.AUDIO,
    category: "Travel",
    thumbSrc: DESIGN_IMG_1,
    title: "City sounds",
    author: "Sam Rivera",
    dateLabel: "18 February 2024",
  },
  {
    id: "a4",
    mediaType: PURCHASED_MEDIA_TYPES.AUDIO,
    category: "Relaxation",
    thumbSrc: DESIGN_IMG_2,
    title: "Ambient hour",
    author: "Oliver Smith",
    dateLabel: "9 February 2024",
  },
];

export const MOCK_PURCHASED_PDFS: PurchasedMediaItem[] = [
  {
    id: "p1",
    mediaType: PURCHASED_MEDIA_TYPES.PDF,
    category: "Food",
    thumbSrc: DESIGN_IMG_3,
    title: "The Mind's Palette",
    author: "Oliver Smith",
    dateLabel: "5 March 2024",
  },
  {
    id: "p2",
    mediaType: PURCHASED_MEDIA_TYPES.PDF,
    category: "Education",
    thumbSrc: DESIGN_IMG_1,
    title: "Course reader",
    author: "Maya Chen",
    dateLabel: "22 February 2024",
  },
  {
    id: "p3",
    mediaType: PURCHASED_MEDIA_TYPES.PDF,
    category: "Travel",
    thumbSrc: DESIGN_IMG_2,
    title: "City guide",
    author: "Sam Rivera",
    dateLabel: "10 February 2024",
  },
  {
    id: "p4",
    mediaType: PURCHASED_MEDIA_TYPES.PDF,
    category: "Relaxation",
    thumbSrc: DESIGN_IMG_3,
    title: "Journal prompts",
    author: "Oliver Smith",
    dateLabel: "4 February 2024",
  },
];
