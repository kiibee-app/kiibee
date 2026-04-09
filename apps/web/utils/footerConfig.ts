export type FooterItem = {
  label: string;
  href: string | null;
};

export type FooterColumn = {
  title: string;
  items: FooterItem[];
};

export const footerConfig: FooterColumn[] = [
  {
    title: "footer.information",
    items: [
      { label: "footer.about", href: "/about-kiibee" },
      { label: "footer.howItWorks", href: "/how-it-works" },
      { label: "footer.forCreators", href: "/creators" },
      { label: "footer.exploreCreators", href: null },
      { label: "footer.pricing", href: "/pricing" },
    ],
  },
  {
    title: "footer.helpfulLinks",
    items: [
      { label: "footer.tutorialVideos", href: "/tutorial-videos" },
      { label: "footer.userGuides", href: null },
    ],
  },
  {
    title: "footer.contactUs",
    items: [{ label: "footer.support", href: "/support" }],
  },
];
