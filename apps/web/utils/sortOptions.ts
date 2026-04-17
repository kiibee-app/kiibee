import type { ImageSource } from "@/utils/Constants";

export type CreatorCategory = "Comedy" | "Music" | "Publication" | "Cooking";

export type CreatorProfile = {
  id: string;
  name: string;
  category: CreatorCategory;
  uploads: number;
  image: ImageSource;
  createdAt: number;
};

export const SORT_OPTIONS = [
  { label: "A-Z", value: "a-z" },
  { label: "Subscribers", value: "subscribers" },
  { label: "Newest", value: "newest" },
] as const;

export const DEFAULT_SORT: SortValue = SORT_OPTIONS[0].value;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
