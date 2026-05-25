import recentCreator from "@/assets/images/creators/recent_creator.webp";
import recentCreator1 from "@/assets/images/creators/recent_creator1.webp";
import recentCreator2 from "@/assets/images/creators/recent_creator2.webp";
import recentCreator3 from "@/assets/images/creators/recent_creator3.webp";
import creatorWomanOrange from "@/assets/images/creators/creator-woman-orange.webp";
import creatorManPodcast from "@/assets/images/creators/creator-man-podcast.webp";
import { TutorialVideo } from "./types";

export const exploreCreatorsData: TutorialVideo[] = [
  {
    id: "camera-and-light",
    title: "Camera and Light",
    category: "Photography",
    creator: "Lars Ulstrup",
    published: "1 day ago",
    focus: "Master minimalist lighting for editorial portraits.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Free",
        href: "/tutorial-videos/camera-and-light",
      },
    ],
    image: recentCreator,
  },
  {
    id: "knitting-pattern",
    title: "Knitting pattern",
    category: "Design",
    creator: "Helle Hansen",
    published: "4 days ago",
    focus: "Combine textures and light to elevate fiber stories.",
    level: "Paid",
    formatLabel: "PDF",
    formatType: "pdf",
    buttons: [
      {
        label: "Rent 39 kr",
        href: "/tutorial-videos/knitting-pattern#rent",
      },
      {
        label: "Buy 139 kr",
        href: "/tutorial-videos/knitting-pattern#buy",
      },
    ],
    image: recentCreator2,
  },
  {
    id: "sculpture",
    title: "Sculpture",
    category: "Educational",
    creator: "Vera Kloss",
    published: "1 year ago",
    focus: "Document sculpting rituals and studio safety tips.",
    level: "Paid",
    formatLabel: "E-pub",
    formatType: "epub",
    buttons: [
      {
        label: "Buy xx kr",
        href: "/tutorial-videos/sculpture",
      },
    ],
    image: recentCreator3,
  },
  {
    id: "greatest-book-cover",
    title: "Greatest Book Cover",
    category: "Design",
    creator: "Catharina Kloss",
    published: "9 days ago",
    focus: "Explore typography and layout choices for bold covers.",
    level: "Paid",
    formatLabel: "PDF",
    formatType: "pdf",
    buttons: [
      {
        label: "Buy xx kr",
        href: "/tutorial-videos/greatest-book-cover",
      },
    ],
    image: recentCreator1,
  },
  {
    id: "adobe-lightroom-guide",
    title: "Adobe Lightroom guide",
    category: "Design",
    creator: "Vera Heiss",
    published: "9 months ago",
    focus: "Build a cleaner editing workflow for polished visual content.",
    level: "Paid",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Rent xx kr",
        href: "/tutorial-videos/adobe-lightroom-guide",
      },
    ],
    image: creatorWomanOrange,
  },
  {
    id: "blouse-pattern",
    title: "Blouse pattern",
    category: "Design",
    creator: "Sally Hansen",
    published: "4 days ago",
    focus: "Combine textures and light to elevate fiber stories.",
    level: "Paid",
    formatLabel: "PDF",
    formatType: "pdf",
    buttons: [
      {
        label: "Buy xx kr",
        href: "/tutorial-videos/blouse-pattern",
      },
    ],
    image: recentCreator2,
  },
  {
    id: "ux-ui-design-course",
    title: "UX/UI design course",
    category: "Educational",
    creator: "Henriette Hansen",
    published: "3 days ago",
    focus: "UX/UI principles and design workflow walkthrough.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Free",
        href: "/tutorial-videos/ux-ui-design-course",
      },
    ],
    image: creatorManPodcast,
  },
  {
    id: "anime-character-design",
    title: "Anime character design",
    category: "Illustrations",
    creator: "Henriette Weiss",
    published: "3 days ago",
    focus: "Character sketching and mood lighting process walkthrough.",
    level: "Paid",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Shop collection 299 kr",
        href: "/tutorial-videos/anime-character-design",
      },
    ],
    image: recentCreator3,
  },
];

export type MainCategory =
  | "all"
  | "technology"
  | "design"
  | "art"
  | "literature"
  | "comedies";

export const filterMapping: Record<MainCategory, string[]> = {
  all: [
    "camera-and-light",
    "knitting-pattern",
    "sculpture",
    "greatest-book-cover",
    "adobe-lightroom-guide",
    "blouse-pattern",
    "ux-ui-design-course",
    "anime-character-design",
  ],
  technology: ["adobe-lightroom-guide", "ux-ui-design-course"],
  design: [
    "knitting-pattern",
    "greatest-book-cover",
    "adobe-lightroom-guide",
    "blouse-pattern",
  ],
  art: ["camera-and-light", "sculpture", "anime-character-design"],
  literature: ["greatest-book-cover"],
  comedies: ["anime-character-design"],
};
