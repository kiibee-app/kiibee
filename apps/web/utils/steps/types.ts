import { ImageSource } from "../Constants";

export type CreatorOnboardingStep = {
  id: number;
  titleKey: string;
  descriptionKey: string;
  image: ImageSource;
  listKey?: string;
};

export type HowItWorksStep = {
  id: string;
  titleKey: string;
  textKey: string;
  img: ImageSource;
};

export type TrendingContentStep = {
  number: string;
  translationKey: string;
};

export type FeatureStep =
  | CreatorOnboardingStep
  | HowItWorksStep
  | TrendingContentStep;
