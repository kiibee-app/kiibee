import type { StaticImageData } from "next/image";

export type TutorialVideo = {
  id: string;
  title: string;
  category: string;
  creator: string;
  published: string;
  focus: string;
  level: string;
  formatLabel: string;
  image: string | StaticImageData;
};
