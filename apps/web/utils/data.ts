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
