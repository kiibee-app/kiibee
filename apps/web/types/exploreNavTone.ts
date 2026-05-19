export type NavTextTone = "dark" | "light";

export type UseExploreNavToneResult = {
  heroRef: React.RefObject<HTMLDivElement | null>;
  trendingRef: React.RefObject<HTMLDivElement | null>;
  navTextTone: NavTextTone;
};
