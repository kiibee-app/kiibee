export const breakpoints = {
  mobile: "320px",
  mobileLg: "540px",
  tablet: "768px",
  desktop: "1024px",
  desktopMd: "1200px",
  desktopLg: "1440px",
} as const;

export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  mobileLg: `@media (max-width: ${breakpoints.mobileLg})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (max-width: ${breakpoints.desktop})`,
  desktopMd: `@media (max-width: ${breakpoints.desktopMd})`,
  desktopLg: `@media (max-width: ${breakpoints.desktopLg})`,
} as const;

export default breakpoints;
