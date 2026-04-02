import "./fonts.css";

export const FontFamily = {
  Poppins_Regular: "Poppins-Regular",
  Poppins_Medium: "Poppins-Medium",
  Poppins_SemiBold: "Poppins-SemiBold",
  Poppins_Bold: "Poppins-Bold",
} as const;

export type FontKey = keyof typeof FontFamily;
export type FontFamilyType = typeof FontFamily;

function fluid(min: number, max: number) {
  const minPx = `${min}px`;
  const maxPx = `${max}px`;
  const slope = (max - min) / 100;
  const preferred = `${(min / 16).toFixed(4)}rem + ${slope.toFixed(4)}vw`;
  return `clamp(${minPx}, ${preferred}, ${maxPx})`;
}

export const typography = {
  fontFamily: "var(--ui-font-family)",
  fontSizes: ["12px", "14px", "16px", "20px", "24px", "32px"],
  Heading7: `font-size: 0.875rem; line-height: 1.25; font-weight: 600;`,
  Heading0: {
    fontSize: fluid(26, 48),
    fontFamily: FontFamily.Poppins_Medium,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export default typography;
