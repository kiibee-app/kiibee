import design from "../assets/images/design.png";
import design1 from "../assets/images/design1.png";
import design2 from "../assets/images/design2.png";
import education from "../assets/images/education.png";
import loginSlide from "../assets/images/auth/loginSlide.png";
import loginSlide1 from "../assets/images/auth/loginSlide1.png";
import loginSlide2 from "../assets/images/auth/loginSlide2.png";

import { TutorialVideo } from "./types";

export type TutorialVideoSection = {
  id: string;
  title: string;
  videoIds: string[];
  gridMaxWidth?: string;
};

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
