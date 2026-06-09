import design1 from "@/assets/images/design1.webp";
import design2 from "@/assets/images/design2.webp";
import design3 from "@/assets/images/design.webp";
import design4 from "@/assets/images/crafts.png";
import design5 from "@/assets/images/flower.png";
import { FORMAT_TYPE } from "../types";

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
