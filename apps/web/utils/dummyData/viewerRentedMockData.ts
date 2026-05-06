import design1 from "@/assets/images/design1.webp";
import design2 from "@/assets/images/design2.webp";
import design3 from "@/assets/images/design.webp";

export type RentedMode = "purchased" | "currently" | "previously";
export type RentedMediaType = "video" | "audio" | "pdf";

export type RentedCollectionItem = {
  id: string;
  title: string;
  author: string;
  elementCount: number;
  coverSrc: string;
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
    title: "Nordic Food Stories",
    author: "Maya Chen",
  },
  {
    id: "rv5",
    mediaType: "video",
    category: "Health",
    thumbSrc: DESIGN_IMG_2,
    title: "Mindful Living",
    author: "Sarah Johnson",
  },
  {
    id: "rv6",
    mediaType: "video",
    category: "Travel",
    thumbSrc: DESIGN_IMG_3,
    title: "Hidden Gems of Europe",
    author: "James Carter",
  },
  {
    id: "rv7",
    mediaType: "video",
    category: "Education",
    thumbSrc: DESIGN_IMG_1,
    title: "The Art of Learning",
    author: "Dr. Alan Park",
  },
  {
    id: "rv8",
    mediaType: "video",
    category: "Food",
    thumbSrc: DESIGN_IMG_2,
    title: "Street Food Around the World",
    author: "Lena Hoffman",
  },
  {
    id: "rv9",
    mediaType: "video",
    category: "Health",
    thumbSrc: DESIGN_IMG_3,
    title: "Yoga for Beginners",
    author: "Priya Sharma",
  },
  {
    id: "rv10",
    mediaType: "video",
    category: "Travel",
    thumbSrc: DESIGN_IMG_1,
    title: "Tokyo After Dark",
    author: "Kenji Nakamura",
  },
  {
    id: "rv11",
    mediaType: "video",
    category: "Education",
    thumbSrc: DESIGN_IMG_2,
    title: "Philosophy of the Mind",
    author: "Prof. David Lee",
  },
  {
    id: "rv12",
    mediaType: "video",
    category: "Food",
    thumbSrc: DESIGN_IMG_3,
    title: "Baking with Science",
    author: "Claire Dupont",
  },
  {
    id: "rv13",
    mediaType: "video",
    category: "Health",
    thumbSrc: DESIGN_IMG_1,
    title: "Sleep Better Tonight",
    author: "Dr. Nora Walsh",
  },
  {
    id: "rv14",
    mediaType: "video",
    category: "Travel",
    thumbSrc: DESIGN_IMG_2,
    title: "Patagonia: Edge of the World",
    author: "Carlos Rivera",
  },
  {
    id: "rv15",
    mediaType: "video",
    category: "Education",
    thumbSrc: DESIGN_IMG_3,
    title: "Introduction to Neuroscience",
    author: "Dr. Emily Chen",
  },
  {
    id: "rv16",
    mediaType: "video",
    category: "Food",
    thumbSrc: DESIGN_IMG_1,
    title: "Mediterranean Kitchen",
    author: "Sofia Andreou",
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
    title: "Nordic Food Stories",
    author: "Maya Chen",
  },
  {
    id: "ra5",
    mediaType: "audio",
    category: "Health",
    thumbSrc: DESIGN_IMG_3,
    title: "Guided Meditation Series",
    author: "Priya Sharma",
  },
  {
    id: "ra6",
    mediaType: "audio",
    category: "Education",
    thumbSrc: DESIGN_IMG_1,
    title: "History of Modern Art",
    author: "Prof. David Lee",
  },
  {
    id: "ra7",
    mediaType: "audio",
    category: "Travel",
    thumbSrc: DESIGN_IMG_2,
    title: "Sounds of Southeast Asia",
    author: "Kenji Nakamura",
  },
  {
    id: "ra8",
    mediaType: "audio",
    category: "Health",
    thumbSrc: DESIGN_IMG_3,
    title: "Stress Relief Podcast",
    author: "Dr. Nora Walsh",
  },
  {
    id: "ra9",
    mediaType: "audio",
    category: "Education",
    thumbSrc: DESIGN_IMG_1,
    title: "The Science of Habits",
    author: "James Carter",
  },
  {
    id: "ra10",
    mediaType: "audio",
    category: "Food",
    thumbSrc: DESIGN_IMG_2,
    title: "Wine & Culture",
    author: "Claire Dupont",
  },
  {
    id: "ra11",
    mediaType: "audio",
    category: "Health",
    thumbSrc: DESIGN_IMG_3,
    title: "Morning Mindfulness",
    author: "Sarah Johnson",
  },
  {
    id: "ra12",
    mediaType: "audio",
    category: "Travel",
    thumbSrc: DESIGN_IMG_1,
    title: "African Safari Diaries",
    author: "Carlos Rivera",
  },
  {
    id: "ra13",
    mediaType: "audio",
    category: "Education",
    thumbSrc: DESIGN_IMG_2,
    title: "Intro to Psychology",
    author: "Dr. Alan Park",
  },
  {
    id: "ra14",
    mediaType: "audio",
    category: "Food",
    thumbSrc: DESIGN_IMG_3,
    title: "The Spice Route",
    author: "Sofia Andreou",
  },
  {
    id: "ra15",
    mediaType: "audio",
    category: "Health",
    thumbSrc: DESIGN_IMG_1,
    title: "Deep Sleep Sounds",
    author: "Lena Hoffman",
  },
  {
    id: "ra16",
    mediaType: "audio",
    category: "Education",
    thumbSrc: DESIGN_IMG_2,
    title: "Critical Thinking 101",
    author: "Prof. David Lee",
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
