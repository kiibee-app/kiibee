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
  href: "/tutorial-videos",
};

export const footerConfig: FooterColumn[] = [
  {
    title: "footer.information",
    items: [
      { label: "footer.about", href: "/about-kiibee" },
      { label: "footer.howItWorks", href: "/how-it-works" },
      { label: "footer.forCreators", href: "/for-creators" },
      { label: "footer.exploreCreators", href: "/explore-creators" },
      { label: "footer.pricing", href: "/pricing" },
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
    items: [{ label: "footer.support", href: "/support" }],
  },
];
