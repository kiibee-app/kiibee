import "./fonts.css";
import { fluid } from "./helperTypography";

export const FontFamily = {
  Default: "Reddit Sans",
} as const;

export const typography = {
  Heading1: {
    fontSize: fluid(48, 64),
    fontFamily: FontFamily.Default,
    fontWeight: 600,
    lineHeight: "75px",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  Heading2: {
    fontSize: fluid(32, 40),
    fontFamily: FontFamily.Default,
    fontWeight: 600,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  Heading3: {
    fontSize: fluid(24, 32),
    fontFamily: FontFamily.Default,
    fontWeight: 600,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  H4_SemiBold: {
    fontSize: fluid(20, 22),
    fontFamily: FontFamily.Default,
    fontWeight: 600,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  H4_Medium: {
    fontSize: fluid(20, 22),
    fontFamily: FontFamily.Default,
    fontWeight: 500,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  H5_Regular: {
    fontSize: fluid(18, 20),
    fontFamily: FontFamily.Default,
    fontWeight: 400,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  H5_Medium: {
    fontSize: fluid(18, 20),
    fontFamily: FontFamily.Default,
    fontWeight: 500,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  Body_Regular: {
    fontSize: fluid(14, 16),
    fontFamily: FontFamily.Default,
    fontWeight: 400,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  Body_Medium: {
    fontSize: fluid(12, 16),
    fontFamily: FontFamily.Default,
    fontWeight: 500,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  Body_Small: {
    fontSize: fluid(10, 11),
    fontFamily: FontFamily.Default,
    fontWeight: 500,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  Body_Bold: {
    fontSize: fluid(10, 11),
    fontFamily: FontFamily.Default,
    fontWeight: 700,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },

  Body_SemiBold: {
    fontSize: fluid(16, 16),
    fontFamily: FontFamily.Default,
    fontWeight: 600,
    lineHeight: "normal",
    fontStyle: "normal",
    letterSpacing: "0px",
  },
} as const;

export type TypographyOptions = typeof typography;
