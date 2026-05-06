import { PATHS } from "./path";

export type FooterItem = {
  label: string;
  href: string | null;
};

export type FooterColumn = {
  title: string;
  items: FooterItem[];
};

const tutorialItem = {
  label: "footer.tutorialVideos",
  href: PATHS.TUTORIAL_VIDEOS,
};

export const footerConfig: FooterColumn[] = [
  {
    title: "footer.information",
    items: [
      { label: "footer.about", href: PATHS.ABOUT },
      { label: "footer.howItWorks", href: PATHS.HOW_IT_WORKS },
      { label: "footer.forCreators", href: PATHS.CREATORS },
      { label: "footer.exploreCreators", href: PATHS.EXPLORE_CREATORS },
      { label: "footer.pricing", href: PATHS.PRICING },
    ],
  },
  {
    title: "footer.helpfulLinks",
    items: [
      tutorialItem,
      { label: "footer.userGuides", href: tutorialItem.href },
    ],
  },
  {
    title: "footer.contactUs",
    items: [{ label: "footer.support", href: PATHS.SUPPORT }],
  },
];
