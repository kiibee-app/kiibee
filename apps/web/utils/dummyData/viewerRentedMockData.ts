import design1 from "@/assets/images/design1.webp";
import design2 from "@/assets/images/design2.webp";
import design3 from "@/assets/images/design.webp";

export type RentedMode = "purchased" | "currently" | "previously";
export type RentedMediaType = "video" | "audio" | "pdf";

export type CollectionAction = {
  label: string;
  sublabel?: string;
  variant?: "primary" | "secondary";
  href?: string;
};

export type RentedCollectionItem = {
  id: string;
  title: string;
  author: string;
  elementCount: number;
  coverSrc: string;
  actions?: CollectionAction[];
  hideBadge?: boolean;
  href?: string;
};

export type RentedMediaItem = {
  id: string;
  mediaType: RentedMediaType;
  category: string;
  thumbSrc: string;
  title: string;
  author: string;
  expiryText: string;
};

const DESIGN_IMG_1 = design1.src;
const DESIGN_IMG_2 = design2.src;
const DESIGN_IMG_3 = design3.src;

const BASE_COLLECTIONS: RentedCollectionItem[] = [
  {
    id: "rc1",
    title: "The Mind's Palette",
    author: "Oliver Smith",
    elementCount: 15,
    coverSrc: DESIGN_IMG_1,
  },
  {
    id: "rc2",
    title: "Adventure in the Swiss Alps",
    author: "Mark Thompson",
    elementCount: 12,
    coverSrc: DESIGN_IMG_3,
  },
  {
    id: "rc3",
    title: "Cognitive Behavioral Techniques",
    author: "Dr. Emily Chen",
    elementCount: 10,
    coverSrc: DESIGN_IMG_2,
  },
  {
    id: "rc4",
    title: "Nordic Food Stories",
    author: "Maya Chen",
    elementCount: 9,
    coverSrc: DESIGN_IMG_1,
  },
];

const BASE_VIDEOS: Omit<RentedMediaItem, "expiryText">[] = [
  {
    id: "rv1",
    mediaType: "video",
    category: "Food",
    thumbSrc: DESIGN_IMG_1,
    title: "The Mind's Palette",
    author: "Oliver Smith",
  },
  {
    id: "rv2",
    mediaType: "video",
    category: "Education",
    thumbSrc: DESIGN_IMG_2,
    title: "Cognitive Behavioral Techniques",
    author: "Dr. Emily Chen",
  },
  {
    id: "rv3",
    mediaType: "video",
    category: "Travel",
    thumbSrc: DESIGN_IMG_3,
    title: "Adventure in the Swiss Alps",
    author: "Mark Thompson",
  },
  {
    id: "rv4",
    mediaType: "video",
    category: "Food",
    thumbSrc: DESIGN_IMG_1,
    title: "The Mind's Palette",
    author: "Oliver Smith",
  },
];

const BASE_AUDIOS: Omit<RentedMediaItem, "expiryText">[] = [
  {
    id: "ra1",
    mediaType: "audio",
    category: "Food",
    thumbSrc: DESIGN_IMG_2,
    title: "The Mind's Palette",
    author: "Oliver Smith",
  },
  {
    id: "ra2",
    mediaType: "audio",
    category: "Education",
    thumbSrc: DESIGN_IMG_3,
    title: "Cognitive Behavioral Techniques",
    author: "Dr. Emily Chen",
  },
  {
    id: "ra3",
    mediaType: "audio",
    category: "Travel",
    thumbSrc: DESIGN_IMG_1,
    title: "Adventure in the Swiss Alps",
    author: "Mark Thompson",
  },
  {
    id: "ra4",
    mediaType: "audio",
    category: "Food",
    thumbSrc: DESIGN_IMG_2,
    title: "The Mind's Palette",
    author: "Oliver Smith",
  },
];

const BASE_PDFS: Omit<RentedMediaItem, "expiryText">[] = [
  {
    id: "rp1",
    mediaType: "pdf",
    category: "Food",
    thumbSrc: DESIGN_IMG_3,
    title: "The Mind's Palette",
    author: "Oliver Smith",
  },
  {
    id: "rp2",
    mediaType: "pdf",
    category: "Education",
    thumbSrc: DESIGN_IMG_1,
    title: "Cognitive Behavioral Techniques",
    author: "Dr. Emily Chen",
  },
  {
    id: "rp3",
    mediaType: "pdf",
    category: "Travel",
    thumbSrc: DESIGN_IMG_3,
    title: "Adventure in the Swiss Alps",
    author: "Mark Thompson",
  },
  {
    id: "rp4",
    mediaType: "pdf",
    category: "Food",
    thumbSrc: DESIGN_IMG_2,
    title: "The Mind's Palette",
    author: "Oliver Smith",
  },
];

const CURRENT_EXPIRES = [
  "Expires in 3 hrs",
  "Expires in 5 hrs",
  "Expires in 36 hrs",
  "Expires in 45 hrs",
];
const PREVIOUS_EXPIRES = [
  "Expired on 3 November 2025",
  "Expired on 5 November 2025",
  "Expired on 3 November 2025",
  "Expired on 3 November 2025",
];

const withExpiry = (
  items: Omit<RentedMediaItem, "expiryText">[],
  labels: string[],
): RentedMediaItem[] =>
  items.map((item, idx) => ({
    ...item,
    expiryText: labels[idx % labels.length],
  }));

export const CURRENT_RENTED_COLLECTIONS = BASE_COLLECTIONS;
export const PREVIOUS_RENTED_COLLECTIONS = BASE_COLLECTIONS;

export const CURRENT_RENTED_VIDEOS = withExpiry(BASE_VIDEOS, CURRENT_EXPIRES);
export const PREVIOUS_RENTED_VIDEOS = withExpiry(BASE_VIDEOS, PREVIOUS_EXPIRES);

export const CURRENT_RENTED_AUDIOS = withExpiry(BASE_AUDIOS, CURRENT_EXPIRES);
export const PREVIOUS_RENTED_AUDIOS = withExpiry(BASE_AUDIOS, PREVIOUS_EXPIRES);

export const CURRENT_RENTED_PDFS = withExpiry(BASE_PDFS, CURRENT_EXPIRES);
export const PREVIOUS_RENTED_PDFS = withExpiry(BASE_PDFS, PREVIOUS_EXPIRES);
