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
