import design from "../assets/images/design.webp";
import design1 from "../assets/images/design1.webp";
import design2 from "../assets/images/design2.webp";
import education from "../assets/images/education.webp";
import loginSlide from "../assets/images/auth/loginSlide.webp";
import loginSlide1 from "../assets/images/auth/loginSlide1.webp";
import loginSlide2 from "../assets/images/auth/loginSlide2.webp";
import recentCreator from "@/assets/images/creators/recent_creator.webp";
import recentCreator1 from "@/assets/images/creators/recent_creator1.webp";
import recentCreator2 from "@/assets/images/creators/recent_creator2.webp";
import recentCreator3 from "@/assets/images/creators/recent_creator3.webp";
import creatorWomanOrange from "@/assets/images/creators/creator-woman-orange.webp";
import creatorManPodcast from "@/assets/images/creators/creator-man-podcast.webp";
import layoutOneImage from "@/assets/images/layout1.png";
import layoutTwoImage from "@/assets/images/layout2.png";
import layoutThreeImage from "@/assets/images/layout3.png";

import type {
  LayoutCardConfig,
  TutorialVideo,
  TutorialVideoSection,
} from "./types";

export const tutorialVideos: TutorialVideo[] = [
  {
    id: "del-2",
    title: "Del 2. Indhold og udsende",
    category: "Design",
    creator: "Kiibee",
    published: "9 months ago",
    focus: "Plan content, scenes, and publishing cadence before you go live.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Free",
        variant: "secondary",
        href: "/tutorial-videos/del-2",
      },
    ],
    image: design,
  },
  {
    id: "del-3",
    title: "Del 3: Styling og styring af flow",
    category: "Design",
    creator: "Kiibee",
    published: "4 days ago",
    focus:
      "Fine-tune the look and pacing of your livestream and on-demand drops.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Free",
        variant: "secondary",
        href: "/tutorial-videos/del-3",
      },
    ],
    image: design1,
  },
  {
    id: "del-4",
    title: "Del 4: Betalingsmodul og sikkerhed",
    category: "Educational",
    creator: "Kiibee",
    published: "1 year ago",
    focus:
      "Connect billing, payouts, and compliance tools for a smooth launch.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Free",
        variant: "secondary",
        href: "/tutorial-videos/del-4",
      },
    ],
    image: design2,
  },
  {
    id: "del-5",
    title: "Del 5: Udbetaling, notifikationer og",
    category: "Educational",
    creator: "Kiibee",
    published: "1 year ago",
    focus:
      "Connect billing, payouts, and compliance tools for a smooth launch.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Free",
        variant: "secondary",
        href: "/tutorial-videos/del-5",
      },
    ],
    image: education,
  },
];

export const tutorialVideoSections: TutorialVideoSection[] = [
  {
    id: "getting-started",
    title: "Getting started",
    videoIds: ["del-2", "del-3", "del-4", "del-5"],
  },
  {
    id: "how-to-videos",
    title: "How-to-videos",
    videoIds: ["del-2", "del-3", "del-4", "del-5"],
  },
  {
    id: "user-guides",
    title: "User guides",
    videoIds: ["del-4", "del-5"],
    gridMaxWidth: "min(640px, 100%)",
  },
];

export const layoutCards: LayoutCardConfig[] = [
  {
    key: "layout1",
    titleKey: "contents.appearance.layouts.options.layout1",
    captionKey: "contents.appearance.layouts.preview",
    image: layoutOneImage,
  },
  {
    key: "layout2",
    titleKey: "contents.appearance.layouts.options.layout2",
    captionKey: "contents.appearance.layouts.preview",
    image: layoutTwoImage,
  },
  {
    key: "layout3",
    titleKey: "contents.appearance.layouts.options.layout3",
    captionKey: "contents.appearance.layouts.preview",
    image: layoutThreeImage,
  },
];

export const slideImages = [
  {
    id: "primary",
    src: loginSlide,
    offsetX: "-8px",
    offsetY: "0px",
    z: 3,
    height: "320px",
  },
  {
    id: "secondary",
    src: loginSlide1,
    offsetX: "2px",
    offsetY: "22px",
    z: 2,
    height: "300px",
  },
  {
    id: "tertiary",
    src: loginSlide2,
    offsetX: "4px",
    offsetY: "44px",
    z: 1,
    height: "280px",
  },
];

export const recentlyAddedVideos: TutorialVideo[] = [
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
        variant: "secondary",
        href: "/tutorial-videos/camera-and-light",
      },
    ],
    image: recentCreator,
  },
  {
    id: "greatest-book-cover",
    title: "Greatest Book Cover",
    category: "Design",
    creator: "Catharina Kloss",
    published: "9 days ago",
    focus: "Explore typography and layout choices for bold covers.",
    level: "Free",
    formatLabel: "PDF",
    formatType: "pdf",
    buttons: [
      {
        label: "Buy 139 kr",
        variant: "secondary",
        href: "/tutorial-videos/greatest-book-cover",
      },
    ],
    image: recentCreator1,
  },
  {
    id: "knitting-pattern",
    title: "Knitting pattern",
    category: "Design",
    creator: "Helle Hansen",
    published: "4 days ago",
    focus: "Combine textures and light to elevate fiber stories.",
    level: "Free",
    formatLabel: "PDF",
    formatType: "pdf",
    buttons: [
      {
        label: "Rent 39 kr",
        variant: "secondary",
        href: "/tutorial-videos/knitting-pattern#rent",
      },
      {
        label: "Buy 139 kr",
        variant: "secondary",
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
    level: "Free",
    formatLabel: "E-pub",
    formatType: "epub",
    buttons: [
      {
        label: "Buy 199 kr",
        variant: "secondary",
        href: "/tutorial-videos/sculpture",
      },
    ],
    image: recentCreator3,
  },
];

export const trendingContentVideos: TutorialVideo[] = [
  {
    id: "adobe-lightroom-guide",
    title: "Adobe Lightroom guide",
    category: "Design",
    creator: "Vera Heiss",
    published: "9 months ago",
    focus: "Build a cleaner editing workflow for polished visual content.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Free",
        variant: "secondary",
        href: "/tutorial-videos/adobe-lightroom-guide",
      },
    ],
    image: recentCreator,
  },
  {
    id: "trending-knitting-pattern",
    title: "Knitting pattern",
    category: "Design",
    creator: "Helle Hansen",
    published: "4 days ago",
    focus: "Combine textures and light to elevate fiber stories.",
    level: "Free",
    formatLabel: "PDF",
    formatType: "pdf",
    buttons: [
      {
        label: "Rent 39 kr",
        variant: "secondary",
        href: "/tutorial-videos/knitting-pattern#rent",
      },
      {
        label: "Buy 139 kr",
        variant: "secondary",
        href: "/tutorial-videos/knitting-pattern#buy",
      },
    ],
    image: recentCreator2,
  },
  {
    id: "trending-sculpture",
    title: "Sculpture",
    category: "Educational",
    creator: "Vera Kloss",
    published: "1 year ago",
    focus: "Document sculpting rituals and studio safety tips.",
    level: "Free",
    formatLabel: "E-pub",
    formatType: "epub",
    buttons: [
      {
        label: "Buy 49 kr",
        variant: "secondary",
        href: "/tutorial-videos/sculpture",
      },
    ],
    image: recentCreator3,
  },
  {
    id: "trending-greatest-book-cover",
    title: "Greatest Book Cover",
    category: "Design",
    creator: "Catharina Kloss",
    published: "9 days ago",
    focus: "Explore typography and layout choices for bold covers.",
    level: "Free",
    formatLabel: "Web content",
    formatType: "web",
    buttons: [
      {
        label: "Buy 49 kr",
        variant: "secondary",
        href: "/tutorial-videos/greatest-book-cover",
      },
    ],
    image: recentCreator1,
  },
];

export const latestReleaseVideos: TutorialVideo[] = [
  {
    id: "latest-adobe-lightroom-guide-1",
    title: "Adobe Lightroom guide",
    category: "Design",
    creator: "Vera Heiss",
    published: "9 months ago",
    focus: "Build a cleaner editing workflow for polished visual content.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Rent 39 kr",
        variant: "secondary",
        href: "/tutorial-videos/adobe-lightroom-guide#rent",
      },
    ],
    image: recentCreator,
  },
  {
    id: "latest-knitting-pattern-2",
    title: "Blouse pattern",
    category: "Design",
    creator: "Sally Hansen",
    published: "4 days ago",
    focus: "Combine textures and light to elevate fiber stories.",
    level: "Free",
    formatLabel: "PDF",
    formatType: "pdf",
    buttons: [
      {
        label: "Buy 99 kr",
        variant: "secondary",
        href: "/tutorial-videos/knitting-pattern#buy",
      },
    ],
    image: recentCreator2,
  },
  {
    id: "latest-anime-character-3",
    title: "Anime character design",
    category: "Illustration",
    creator: "Henriette Welks",
    published: "3 days ago",
    focus: "Character sketching and mood lighting process walkthrough.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Shop collection 299 kr",
        variant: "secondary",
        href: "/tutorial-videos/sculpture",
      },
    ],
    image: recentCreator3,
  },
  {
    id: "latest-kammas-kantine-4",
    title: "Kammas Kantine",
    category: "Course",
    creator: "Kamma",
    published: "3 days ago",
    focus: "Plan, prep, and publish a weekly food content series.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Shop collection 199 kr",
        variant: "secondary",
        href: "/tutorial-videos/camera-and-light",
      },
    ],
    image: recentCreator1,
  },
  {
    id: "latest-adobe-lightroom-guide-5",
    title: "Adobe Lightroom guide",
    category: "Design",
    creator: "Vera Heiss",
    published: "7 months ago",
    focus: "Preset workflows for faster batch editing.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Rent 39 kr",
        variant: "secondary",
        href: "/tutorial-videos/adobe-lightroom-guide#rent",
      },
    ],
    image: recentCreator,
  },
  {
    id: "latest-blouse-pattern-6",
    title: "Blouse pattern",
    category: "Design",
    creator: "Sally Hansen",
    published: "4 days ago",
    focus: "Pattern structure and export-ready printable layouts.",
    level: "Free",
    formatLabel: "PDF",
    formatType: "pdf",
    buttons: [
      {
        label: "Buy 99 kr",
        variant: "secondary",
        href: "/tutorial-videos/knitting-pattern#buy",
      },
    ],
    image: recentCreator2,
  },
  {
    id: "latest-anime-character-7",
    title: "Anime character design",
    category: "Illustration",
    creator: "Henriette Welks",
    published: "3 days ago",
    focus: "Stylized portraits and neon scene composition.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Shop collection 299 kr",
        variant: "secondary",
        href: "/tutorial-videos/sculpture",
      },
    ],
    image: recentCreator3,
  },
  {
    id: "latest-kammas-kantine-8",
    title: "Kammas Kantine",
    category: "Course",
    creator: "Kamma",
    published: "3 days ago",
    focus: "Turn cooking classes into repeatable content bundles.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Shop collection 199 kr",
        variant: "secondary",
        href: "/tutorial-videos/camera-and-light",
      },
    ],
    image: recentCreator1,
  },
  {
    id: "latest-adobe-lightroom-guide-9",
    title: "Adobe Lightroom guide",
    category: "Design",
    creator: "Vera Heiss",
    published: "9 months ago",
    focus: "Color grading for consistent creator branding.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Rent 39 kr",
        variant: "secondary",
        href: "/tutorial-videos/adobe-lightroom-guide#rent",
      },
    ],
    image: recentCreator,
  },
  {
    id: "latest-blouse-pattern-10",
    title: "Blouse pattern",
    category: "Design",
    creator: "Sally Hansen",
    published: "4 days ago",
    focus: "Simple garment templates for quick monetization packs.",
    level: "Free",
    formatLabel: "PDF",
    formatType: "pdf",
    buttons: [
      {
        label: "Buy 99 kr",
        variant: "secondary",
        href: "/tutorial-videos/knitting-pattern#buy",
      },
    ],
    image: recentCreator2,
  },
  {
    id: "latest-anime-character-11",
    title: "Anime character design",
    category: "Illustration",
    creator: "Henriette Welks",
    published: "3 days ago",
    focus: "Pose library and expressive face variations for creators.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Shop collection 299 kr",
        variant: "secondary",
        href: "/tutorial-videos/sculpture",
      },
    ],
    image: recentCreator3,
  },
  {
    id: "latest-kammas-kantine-12",
    title: "Kammas Kantine",
    category: "Course",
    creator: "Kamma",
    published: "3 days ago",
    focus: "Package content into beginner-friendly recipe journeys.",
    level: "Free",
    formatLabel: "Video",
    formatType: "video",
    buttons: [
      {
        label: "Shop collection 199 kr",
        variant: "secondary",
        href: "/tutorial-videos/camera-and-light",
      },
    ],
    image: recentCreator1,
  },
];

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

export const EXPLORE_CATEGORIES: MainCategory[] = [
  "all",
  "technology",
  "design",
  "art",
  "literature",
  "comedies",
];
