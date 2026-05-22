export const NAV_TONE = {
  DARK: "dark",
  LIGHT: "light",
} as const;

export type NavTextTone = (typeof NAV_TONE)[keyof typeof NAV_TONE];

export type UseExploreNavToneResult = {
  heroRef: React.RefObject<HTMLDivElement | null>;
  trendingRef: React.RefObject<HTMLDivElement | null>;
  navTextTone: NavTextTone;
};
