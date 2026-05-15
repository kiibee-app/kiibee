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
  translationKey: string;
};

export const steps: Step[] = [
  {
    number: "01",
    translationKey: "browse",
  },
  {
    number: "02",
    translationKey: "choose",
  },
  {
    number: "03",
    translationKey: "enjoy",
  },
];
