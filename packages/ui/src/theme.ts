import COLORS, { ColorPalette } from "./colors";
import { typography as TypographySystem } from "./typography";
import breakpoints from "./breakpoints";

export type BreakPoints = typeof breakpoints;
export type TypographyOptions = typeof TypographySystem;

export interface Theme {
  colors: ColorPalette;
  typography: TypographyOptions;
  media: BreakPoints;
  spacing: Record<string, string> & ((n: number) => string);
  radius: Record<string, string>;
  sizes: Record<string, string>;
  shadows: Record<string, string>;
  animations: Record<string, string>;
  heights: Record<string, string>;
}

const spacingScale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48];

function createSpacing(scale: number[]) {
  const fn = (n: number) => `${scale[n] ?? n * 4}px`;
  return Object.assign(fn, {
    scale,
    xs: `${scale[1]}px`,
    sm: `${scale[2]}px`,
    md: `${scale[4]}px`,
    lg: `${scale[6]}px`,
  });
}

const borderRadius = {
  none: "0",
  sm: "4px",
  xl: "6px",
  md: "8px",
  lg: "12px",
  full: "9999px",
};

const sizes = {
  container: "1200px",
  sidebar: "280px",
};

const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 12px rgba(2,6,23,0.08)",
  lg: "0 10px 30px rgba(2,6,23,0.12)",
};

const animations = {
  fast: "150ms ease",
  normal: "300ms ease",
  slow: "500ms ease",
};

const heights = {
  header: "64px",
  footer: "72px",
};

const spacing = createSpacing(spacingScale);

export const theme: Theme = {
  colors: COLORS,
  typography: TypographySystem,
  media: breakpoints,
  spacing: spacing as unknown as Record<string, string> &
    ((n: number) => string),
  radius: borderRadius,
  sizes,
  shadows,
  animations,
  heights,
};

export default theme;
