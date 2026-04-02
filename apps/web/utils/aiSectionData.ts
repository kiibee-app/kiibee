export type TrendingContentItem = {
  category: string;
  title: string;
  creator: string;
  action: string;
};

export type Creator = {
  name: string;
  detail: string;
};

export type Step = {
  number: string;
  label: string;
  description: string;
};

export const trendingContent: TrendingContentItem[] = [
  {
    category: "Design",
    title: "Adobe Lightroom guide",
    creator: "Vera Hells",
    action: "Free",
  },
  {
    category: "Design",
    title: "Knitting pattern",
    creator: "Helle Hansen",
    action: "Rent 2x",
  },
  {
    category: "Educational",
    title: "Sculpture Mastery",
    creator: "Vera Kloss",
    action: "Buy 4x",
  },
  {
    category: "Design",
    title: "Greatest Book Cover",
    creator: "Catharina Klass",
    action: "New Drop",
  },
];

export const creators: Creator[] = [
  { name: "Chefi", detail: "24K Subscribers" },
  { name: "Morten Binde", detail: "39K Subscribers" },
  { name: "Kammas Kantine", detail: "10K Subscribers" },
  { name: "Simon Talbot", detail: "46K Subscribers" },
  { name: "Jacob Tarnhoff", detail: "68K Subscribers" },
];

export const steps: Step[] = [
  {
    number: "01",
    label: "Browse",
    description: "Discover creators and collections that match your interests.",
  },
  {
    number: "02",
    label: "Choose",
    description: "Rent, buy, or access the content directly on Kiibee.",
  },
  {
    number: "03",
    label: "Enjoy",
    description: "Stream or download instantly, anytime, anywhere.",
  },
];
