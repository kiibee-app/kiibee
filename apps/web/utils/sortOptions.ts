import { StaticImageData } from "next/image";

export type CreatorCategory = "Comedy" | "Music" | "Publication" | "Cooking";

export type CreatorProfile = {
  id: string;
  name: string;
  category: CreatorCategory;
  uploads: number;
  image: string | StaticImageData;
  createdAt: number;
};
