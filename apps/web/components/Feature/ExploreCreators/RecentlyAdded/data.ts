import design from "@/assets/images/design.png";
import design1 from "@/assets/images/design1.png";
import design2 from "@/assets/images/design2.png";
import education from "@/assets/images/education.png";
import { TutorialVideo } from "@/utils/types";

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
    image: design,
  },
  {
    id: "greatest-book-cover",
    title: "Greatest Book Cover",
    category: "Design",
    creator: "Catharina Kloss",
    published: "9 days ago",
    focus: "Explore typography and layout choices for bold covers.",
    level: "Free",
    formatLabel: "Video",
    image: design1,
  },
  {
    id: "knitting-pattern",
    title: "Knitting pattern",
    category: "Design",
    creator: "Helle Hansen",
    published: "4 days ago",
    focus: "Combine textures and light to elevate fiber stories.",
    level: "Free",
    formatLabel: "Video",
    image: design2,
  },
  {
    id: "sculpture",
    title: "Sculpture",
    category: "Educational",
    creator: "Vera Kloss",
    published: "1 year ago",
    focus: "Document sculpting rituals and studio safety tips.",
    level: "Free",
    formatLabel: "Video",
    image: education,
  },
];
