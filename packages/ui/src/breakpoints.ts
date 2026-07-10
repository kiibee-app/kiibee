export const breakpoints = {
  mobile: "320px",
  mobileSm: "360px",
  mobileMd: "425px",
  mobileLg: "540px",
  mobileXl: "640px",
  tablet: "768px",
  desktopSm: "900px",
  desktop: "1024px",
  desktopMd: "1200px",
  desktopLg: "1440px",
} as const;

export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  mobileSm: `@media (max-width: ${breakpoints.mobileSm})`,
  mobileMd: `@media (max-width: ${breakpoints.mobileMd})`,
  mobileLg: `@media (max-width: ${breakpoints.mobileLg})`,
  mobileXl: `@media (max-width: ${breakpoints.mobileXl})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktopSm: `@media (max-width: ${breakpoints.desktopSm})`,
  desktop: `@media (max-width: ${breakpoints.desktop})`,
  desktopMd: `@media (max-width: ${breakpoints.desktopMd})`,
  desktopLg: `@media (max-width: ${breakpoints.desktopLg})`,
} as const;

export default breakpoints;
