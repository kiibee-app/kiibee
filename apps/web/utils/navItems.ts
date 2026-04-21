export type NavChildItem = {
  key: string;
  href: string;
};

export type NavColumn = {
  titleKey: string;
  items: NavChildItem[];
};

export type NavItem = {
  key: string;
  href?: string;
  children?: NavColumn[];
};

const NAV_ITEMS: NavItem[] = [
  { key: "nav.howItWorks", href: "/how-it-works" },
  {
    key: "nav.exploreCreators",
    href: "/explore",
    children: [
      {
        titleKey: "nav.explore.allContentTitle",
        items: [
          { key: "nav.explore.everything", href: "/explore" },
          { key: "nav.explore.newReleases", href: "/explore?filter=new" },
          { key: "nav.explore.popular", href: "/explore?sort=popular" },
          { key: "nav.explore.freeContent", href: "/explore?filter=free" },
        ],
      },
      {
        titleKey: "nav.explore.formatTitle",
        items: [
          { key: "nav.explore.format.video", href: "/explore?format=video" },
          { key: "nav.explore.format.audio", href: "/explore?format=audio" },
          { key: "nav.explore.format.pdf", href: "/explore?format=pdf" },
          { key: "nav.explore.format.epub", href: "/explore?format=epub" },
          { key: "nav.explore.format.web", href: "/explore?format=web" },
        ],
      },
      {
        titleKey: "nav.explore.categoryTitle",
        items: [
          {
            key: "nav.explore.category.comedy",
            href: "/explore/category/comedy",
          },
          {
            key: "nav.explore.category.education",
            href: "/explore/category/education",
          },
          {
            key: "nav.explore.category.business",
            href: "/explore/category/business",
          },
          { key: "nav.explore.category.arts", href: "/explore/category/arts" },
          { key: "nav.explore.category.tech", href: "/explore/category/tech" },
        ],
      },
      {
        titleKey: "nav.explore.creatorTitle",
        items: [
          { key: "nav.explore.creator.allCreators", href: "/creators" },
          {
            key: "nav.explore.creator.featured",
            href: "/creators?filter=featured",
          },
          {
            key: "nav.explore.creator.newCreators",
            href: "/creators?filter=new",
          },
          {
            key: "nav.explore.creator.popular",
            href: "/creators?sort=popular",
          },
        ],
      },
    ],
  },
  { key: "nav.about", href: "/about-kiibee" },
];

export default NAV_ITEMS;
