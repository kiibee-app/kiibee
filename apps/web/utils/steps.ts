import dashboardImage from "@/assets/images/creator-dashboard.png";
import step1 from "../assets/images/steps/step1.webp";
import step2 from "../assets/images/steps/step2.webp";
import step3 from "../assets/images/steps/step3.webp";
import {
  CreatorOnboardingStep,
  HowItWorksStep,
  TrendingContentStep,
} from "./steps/types";

export const creatorOnboardingSteps: CreatorOnboardingStep[] = [
  {
    id: 1,
    titleKey: "creators.howToGetStarted.steps.requestAccess.title",
    descriptionKey: "creators.howToGetStarted.steps.requestAccess.description",
    image: dashboardImage,
  },
  {
    id: 2,
    titleKey: "creators.howToGetStarted.steps.getApproved.title",
    descriptionKey: "creators.howToGetStarted.steps.getApproved.description",
    image: dashboardImage,
  },
  {
    id: 3,
    titleKey: "creators.howToGetStarted.steps.dashboard.title",
    descriptionKey: "creators.howToGetStarted.steps.dashboard.description",
    image: dashboardImage,
  },
  {
    id: 4,
    titleKey: "creators.howToGetStarted.steps.contentCollections.title",
    descriptionKey:
      "creators.howToGetStarted.steps.contentCollections.description",
    listKey: "creators.howToGetStarted.steps.contentCollections.list",
    image: dashboardImage,
  },
  {
    id: 5,
    titleKey: "creators.howToGetStarted.steps.usersSales.title",
    descriptionKey: "creators.howToGetStarted.steps.usersSales.description",
    listKey: "creators.howToGetStarted.steps.usersSales.list",
    image: dashboardImage,
  },
  {
    id: 6,
    titleKey: "creators.howToGetStarted.steps.settingsPayouts.title",
    descriptionKey:
      "creators.howToGetStarted.steps.settingsPayouts.description",
    image: dashboardImage,
  },
  {
    id: 7,
    titleKey: "creators.howToGetStarted.steps.profileSettings.title",
    descriptionKey:
      "creators.howToGetStarted.steps.profileSettings.description",
    image: dashboardImage,
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: "browse",
    titleKey: "how.steps.browseTitle",
    textKey: "how.steps.browseText",
    img: step1,
  },
  {
    id: "choose",
    titleKey: "how.steps.chooseTitle",
    textKey: "how.steps.chooseText",
    img: step2,
  },
  {
    id: "access",
    titleKey: "how.steps.accessTitle",
    textKey: "how.steps.accessText",
    img: step3,
  },
];

export const trendingContentSteps: TrendingContentStep[] = [
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

export type {
  CreatorOnboardingStep,
  HowItWorksStep,
  TrendingContentStep,
  FeatureStep,
} from "./steps/types";
