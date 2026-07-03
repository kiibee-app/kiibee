import design from "../assets/images/design.webp";
import design1 from "../assets/images/design1.webp";
import design2 from "../assets/images/design2.webp";
import education from "../assets/images/education.webp";
import loginSlide from "../assets/images/auth/loginSlide.webp";
import loginSlide1 from "../assets/images/auth/loginSlide1.webp";
import loginSlide2 from "../assets/images/auth/loginSlide2.webp";
import layoutOneImage from "@/assets/images/layout1.png";
import layoutTwoImage from "@/assets/images/layout2.png";
import layoutThreeImage from "@/assets/images/layout3.png";
import creator from "@/assets/images/testimonial/creator.webp";
import valueBg from "@/assets/images/cta-buttom.webp";
import ctaImage from "@/assets/images/cta-buttom1.webp";

import type {
  LayoutCardConfig,
  TutorialVideo,
  TutorialVideoSection,
  TestimonialSlideConfig,
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

export const testimonialSlides: TestimonialSlideConfig[] = [
  {
    id: 1,
    image: creator,
    bgPosition: "32% 22%",
    bgPositionMobile: "center 20%",
    quoteKey: "testimonial.quote",
    authorKey: "testimonial.author",
  },
  {
    id: 2,
    image: valueBg,
    bgPosition: "center",
    bgPositionMobile: "center",
    quoteKey: "testimonial.quote2",
    authorKey: "testimonial.author2",
  },
  {
    id: 3,
    image: ctaImage,
    bgPosition: "center",
    bgPositionMobile: "center",
    quoteKey: "testimonial.quote3",
    authorKey: "testimonial.author3",
  },
];
