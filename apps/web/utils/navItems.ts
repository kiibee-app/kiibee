import { PATHS } from "./path";

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
  {
    key: "nav.howItWorks",
    href: PATHS.HOW_IT_WORKS,
  },

  {
    key: "nav.exploreCreators",
    href: PATHS.EXPLORE,
    children: [
      {
        titleKey: "nav.explore.allContentTitle",
        items: [
          { key: "nav.explore.everything", href: PATHS.EXPLORE_EVERYTHING },
          { key: "nav.explore.newReleases", href: PATHS.EXPLORE_NEW },
          { key: "nav.explore.popular", href: PATHS.EXPLORE_POPULAR },
          { key: "nav.explore.freeContent", href: PATHS.EXPLORE_FREE },
        ],
      },

      {
        titleKey: "nav.explore.formatTitle",
        items: [
          { key: "nav.explore.format.video", href: PATHS.EXPLORE_VIDEO },
          { key: "nav.explore.format.audio", href: PATHS.EXPLORE_AUDIO },
          { key: "nav.explore.format.pdf", href: PATHS.EXPLORE_PDF },
          { key: "nav.explore.format.epub", href: PATHS.EXPLORE_EPUB },
          { key: "nav.explore.format.web", href: PATHS.EXPLORE_WEB },
        ],
      },

      {
        titleKey: "nav.explore.categoryTitle",
        items: [
          { key: "nav.explore.category.comedy", href: PATHS.CATEGORY_COMEDY },
          {
            key: "nav.explore.category.education",
            href: PATHS.CATEGORY_EDUCATION,
          },
          {
            key: "nav.explore.category.business",
            href: PATHS.CATEGORY_BUSINESS,
          },
          { key: "nav.explore.category.arts", href: PATHS.CATEGORY_ARTS },
          { key: "nav.explore.category.tech", href: PATHS.CATEGORY_TECH },
        ],
      },

      {
        titleKey: "nav.explore.creatorTitle",
        items: [
          { key: "nav.explore.creator.allCreators", href: PATHS.CREATORS },
          {
            key: "nav.explore.creator.featured",
            href: PATHS.CREATORS_FEATURED,
          },
          { key: "nav.explore.creator.newCreators", href: PATHS.CREATORS_NEW },
          { key: "nav.explore.creator.popular", href: PATHS.CREATORS_POPULAR },
        ],
      },
    ],
  },

  {
    key: "nav.about",
    href: PATHS.ABOUT,
  },
];

export default NAV_ITEMS;
