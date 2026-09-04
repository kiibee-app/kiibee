import imgGetDiscovered from "@/assets/images/steps/get-discovered.webp";
import imgFrictionlessPayments from "@/assets/images/steps/frictionless-payments.webp";
import imgSellFromOwnWebsite from "@/assets/images/steps/sell-from-your-own-website.webp";
import imgPromotionsDiscountCodes from "@/assets/images/steps/promotions-discount-codes.webp";
import imgDataThatDrivesGrowth from "@/assets/images/steps/data-that-drives-growth.webp";
import imgFocusOnCreating from "@/assets/images/steps/focus-on-creating.webp";
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
    titleKey: "creators.howToGetStarted.steps.createProfile.title",
    descriptionKey: "creators.howToGetStarted.steps.createProfile.description",
    image: imgFocusOnCreating,
  },
  {
    id: 2,
    titleKey: "creators.howToGetStarted.steps.uploadAndPublish.title",
    descriptionKey:
      "creators.howToGetStarted.steps.uploadAndPublish.description",
    image: imgFrictionlessPayments,
  },
  {
    id: 3,
    titleKey: "creators.howToGetStarted.steps.connectWebsite.title",
    descriptionKey: "creators.howToGetStarted.steps.connectWebsite.description",
    image: imgSellFromOwnWebsite,
  },
  {
    id: 4,
    titleKey: "creators.howToGetStarted.steps.launchPromotions.title",
    descriptionKey:
      "creators.howToGetStarted.steps.launchPromotions.description",
    image: imgPromotionsDiscountCodes,
  },
  {
    id: 5,
    titleKey: "creators.howToGetStarted.steps.trackSales.title",
    descriptionKey: "creators.howToGetStarted.steps.trackSales.description",
    image: imgDataThatDrivesGrowth,
  },
  {
    id: 6,
    titleKey: "creators.howToGetStarted.steps.reachCustomers.title",
    descriptionKey: "creators.howToGetStarted.steps.reachCustomers.description",
    image: imgGetDiscovered,
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
