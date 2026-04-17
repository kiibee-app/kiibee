import dashboardImage from "@/assets/images/creator-dashboard.png";
import type { ImageSource } from "@/utils/Constants";

export interface Step {
  id: number;
  titleKey: string;
  descriptionKey: string;
  image: ImageSource;
  listKey?: string;
}

export const steps: Step[] = [
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
