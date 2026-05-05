import design1 from "@/assets/images/design1.webp";
import design2 from "@/assets/images/design2.webp";
import design3 from "@/assets/images/design.webp";

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
  buyPriceKr?: number;
  rentPriceKr?: number;
};

export type PurchasedCollectionItem = {
  id: string;
  title: string;
  author: string;
  elementCount: number;
  coverSrc: string;
  /** Optional pricing for rent/buy CTAs (e.g. previously rented). */
  buyPriceKr?: number;
  rentPriceKr?: number;
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

export const MOCK_PREVIOUSLY_RENTED_COLLECTIONS: PurchasedCollectionItem[] = [
  {
    id: "pr-c1",
    title: "The Mind's Palette",
    author: "Oliver Smith",
    elementCount: 15,
    coverSrc: DESIGN_IMG_1,
    buyPriceKr: 149,
    rentPriceKr: 49,
  },
  {
    id: "pr-c2",
    title: "Urban Stories",
    author: "Maya Chen",
    elementCount: 8,
    coverSrc: DESIGN_IMG_2,
    buyPriceKr: 129,
    rentPriceKr: 39,
  },
];

export const MOCK_PREVIOUSLY_RENTED_VIDEOS: PurchasedMediaItem[] = [
  {
    id: "pr-v1",
    mediaType: PURCHASED_MEDIA_TYPES.VIDEO,
    category: "Food",
    thumbSrc: DESIGN_IMG_1,
    title: "Cognitive Behavioral Techn…",
    author: "Dr. Emily Chen",
    dateLabel: "3 November 2025",
    buyPriceKr: 149,
    rentPriceKr: 49,
  },
  {
    id: "pr-v2",
    mediaType: PURCHASED_MEDIA_TYPES.VIDEO,
    category: "Education",
    thumbSrc: DESIGN_IMG_2,
    title: "Evening wind-down",
    author: "Maya Chen",
    dateLabel: "3 November 2025",
    buyPriceKr: 129,
    rentPriceKr: 39,
  },
  {
    id: "pr-v3",
    mediaType: PURCHASED_MEDIA_TYPES.VIDEO,
    category: "Travel",
    thumbSrc: DESIGN_IMG_3,
    title: "Coastline walk",
    author: "Sam Rivera",
    dateLabel: "28 October 2025",
    buyPriceKr: 99,
    rentPriceKr: 29,
  },
  {
    id: "pr-v4",
    mediaType: PURCHASED_MEDIA_TYPES.VIDEO,
    category: "Education",
    thumbSrc: DESIGN_IMG_1,
    title: "Systems 101",
    author: "Oliver Smith",
    dateLabel: "15 October 2025",
    buyPriceKr: 119,
    rentPriceKr: 35,
  },
];

export const MOCK_PREVIOUSLY_RENTED_AUDIOS: PurchasedMediaItem[] = [
  {
    id: "pr-a1",
    mediaType: PURCHASED_MEDIA_TYPES.AUDIO,
    category: "Food",
    thumbSrc: DESIGN_IMG_2,
    title: "The Mind's Palette",
    author: "Oliver Smith",
    dateLabel: "3 November 2025",
    buyPriceKr: 89,
    rentPriceKr: 25,
  },
  {
    id: "pr-a2",
    mediaType: PURCHASED_MEDIA_TYPES.AUDIO,
    category: "Education",
    thumbSrc: DESIGN_IMG_3,
    title: "Lecture notes",
    author: "Maya Chen",
    dateLabel: "1 November 2025",
    buyPriceKr: 79,
    rentPriceKr: 22,
  },
  {
    id: "pr-a3",
    mediaType: PURCHASED_MEDIA_TYPES.AUDIO,
    category: "Travel",
    thumbSrc: DESIGN_IMG_1,
    title: "City sounds",
    author: "Sam Rivera",
    dateLabel: "28 October 2025",
    buyPriceKr: 69,
    rentPriceKr: 19,
  },
  {
    id: "pr-a4",
    mediaType: PURCHASED_MEDIA_TYPES.AUDIO,
    category: "Relaxation",
    thumbSrc: DESIGN_IMG_2,
    title: "Ambient hour",
    author: "Oliver Smith",
    dateLabel: "20 October 2025",
    buyPriceKr: 59,
    rentPriceKr: 15,
  },
];

export const MOCK_PREVIOUSLY_RENTED_PDFS: PurchasedMediaItem[] = [
  {
    id: "pr-p1",
    mediaType: PURCHASED_MEDIA_TYPES.PDF,
    category: "Food",
    thumbSrc: DESIGN_IMG_3,
    title: "The Mind's Palette",
    author: "Oliver Smith",
    dateLabel: "3 November 2025",
    buyPriceKr: 49,
    rentPriceKr: 15,
  },
  {
    id: "pr-p2",
    mediaType: PURCHASED_MEDIA_TYPES.PDF,
    category: "Education",
    thumbSrc: DESIGN_IMG_1,
    title: "Course reader",
    author: "Maya Chen",
    dateLabel: "29 October 2025",
    buyPriceKr: 39,
    rentPriceKr: 12,
  },
  {
    id: "pr-p3",
    mediaType: PURCHASED_MEDIA_TYPES.PDF,
    category: "Travel",
    thumbSrc: DESIGN_IMG_2,
    title: "City guide",
    author: "Sam Rivera",
    dateLabel: "25 October 2025",
    buyPriceKr: 29,
    rentPriceKr: 9,
  },
  {
    id: "pr-p4",
    mediaType: PURCHASED_MEDIA_TYPES.PDF,
    category: "Relaxation",
    thumbSrc: DESIGN_IMG_3,
    title: "Journal prompts",
    author: "Oliver Smith",
    dateLabel: "18 October 2025",
    buyPriceKr: 19,
    rentPriceKr: 7,
  },
];
