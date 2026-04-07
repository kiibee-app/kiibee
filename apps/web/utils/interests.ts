export type InterestVariant = "white" | "light" | "green" | "dark";

export interface InterestItem {
  label: string;
  variant: InterestVariant;
}

export const interests: InterestItem[] = [
  { label: "interests.ebooks", variant: "white" },
  { label: "interests.lectures", variant: "light" },
  { label: "interests.courses", variant: "dark" },
  { label: "interests.podcasts", variant: "green" },
  { label: "interests.comedies", variant: "light" },
  { label: "interests.photography", variant: "green" },
  { label: "interests.audiobooks", variant: "light" },
  { label: "interests.music", variant: "white" },
  { label: "interests.artwork", variant: "light" },
  { label: "interests.meditation", variant: "dark" },
  { label: "interests.fitness", variant: "dark" },
  { label: "interests.theater", variant: "green" },
  { label: "interests.sound", variant: "light" },
  { label: "interests.articles", variant: "white" },
];
