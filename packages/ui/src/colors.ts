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
    RED: string;
  };
  secondary: {
    LIGHT: string;
    DEFAULT: string;
    DARK: string;
  };
  neutral: {
    WHITE: string;
    BLACK: string;
    GRAY_100: string;
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
    RED: "rgb(220,38,38)",
  },

  secondary: {
    LIGHT: "rgb(191,219,254)",
    DEFAULT: "rgb(59,130,246)",
    DARK: "rgb(30,58,138)",
  },

  neutral: {
    WHITE: "rgb(255,255,255)",
    BLACK: "rgb(0,0,0)",
    GRAY_100: "rgb(243,244,246)",
    DUSTY_TEAL: "rgb(88,157,150)",
    OVERLAY: "rgba(15,23,42,0.6)",
  },
};

export default COLORS;
