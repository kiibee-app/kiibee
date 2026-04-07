export type NavItem = {
  key: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: "nav.howItWorks", href: "/how-it-works" },
  { key: "nav.exploreCreators", href: "#explore-creators" },
  { key: "nav.about", href: "/about-kiibee" },
];

export default NAV_ITEMS;
