// Detailed breakpoint scale + a media helper object for convenience.
// This file exports:
// - `breakpoints` (raw pixel/string values)
// - `media` (helper strings like `@media (max-width: ...)` or `@media (min-width: ...)`)
// - default export is `breakpoints` for backwards compatibility with the theme.

export const breakpoints = {
  mobile: "320px",
  tablet: "768px",
  desktop: "1024px",
  desktopLg: "1440px",
} as const;

export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  desktopLg: `@media (min-width: ${breakpoints.desktopLg})`,
} as const;

export default breakpoints;
