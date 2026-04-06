export type ColorScale = Record<number | string, string>;

export interface ColorPalette {
  primary: {
    WHITE: string;
    WHITE_10: string;
    WHITE_90: string;
    WHITE_18: string;
    BLACK: string;
    BLACK_90: string;
    GREEN: string;
    GREEN_50: string;
    RED: string;
    GREEN_10: string;
    GREEN_30: string;
    GREEN_100: string;
    PALE_GREEN: string;
  };
  secondary: {
    LIGHT: string;
    DEFAULT: string;
    DARK: string;
    main: string;
    muted: string;
    border: string;
  };
  neutral: {
    WHITE: string;
    BLACK: string;
    GRAY: string;
    GRAY_100: string;
    GRAY_700: string;
    DUSTY_TEAL: string;
    OVERLAY: string;
  };
}

export const COLORS: ColorPalette = {
  primary: {
    WHITE: "rgb(255,255,255)",
    WHITE_10: "rgba(255,255,255,0.1)",
    WHITE_90: "rgba(255,255,255,0.9)",
    WHITE_18: "rgba(255,255,255,0.18)",
    BLACK: "rgb(0,0,0)",
    BLACK_90: "rgba(0,0,0,0.9)",
    GREEN: "rgb(83,186,169)",
    GREEN_50: "rgba(195,222,181,1)",
    RED: "rgb(220,38,38)",
    GREEN_10: "rgba(255, 255, 255, 0.10)",
    GREEN_30: "rgba(246, 246, 246, 0.30)",
    GREEN_100: "rgba(4, 41, 11, 1)",
    PALE_GREEN: "rgba(207, 240, 192, 1)",
  },

  secondary: {
    LIGHT: "rgb(191,219,254)",
    DEFAULT: "rgb(59,130,246)",
    DARK: "rgb(30,58,138)",
    main: "rgb(17,24,39)",
    muted: "rgb(107,114,128)",
    border: "rgb(243,244,246)",
  },

  neutral: {
    WHITE: "rgb(255,255,255)",
    BLACK: "rgb(0,0,0)",
    GRAY: "rgba(6, 6, 6, 0.6)",
    GRAY_100: "rgb(243,244,246)",
    GRAY_700: "rgb(55,65,81)",
    DUSTY_TEAL: "rgb(88,157,150)",
    OVERLAY: "rgba(15,23,42,0.6)",
  },
};

export default COLORS;
