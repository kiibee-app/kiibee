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
    GREEN_10: string;
    GREEN_30: string;
    GREEN_100: string;
    PALE_GREEN: string;
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
  gredint: {
    GREEN: string;
    PALE_GREEN: string;
    BLUE: string;
    LIGHT_BLUE: string;
    DEEP_GREEN: string;
    RED: string;
    DARK_BLUE: string;
    BLACK: string;
    BLACK_90: string;
    CANVAS_BG: string;
    CARD_BG: string;
    CARD_SHADOW: string;
    CARD_TINT: string;
    OVERLAY_TOP_START: string;
    OVERLAY_TOP_MID: string;
    OVERLAY_TOP_END: string;
    OVERLAY_SIDE_SOLID: string;
    OVERLAY_SIDE_MID: string;
    OVERLAY_SIDE_FADE: string;
    VIGNETTE_INNER: string;
    VIGNETTE_OUTER: string;
    VIGNETTE_SIDE: string;
    VIGNETTE_SIDE_CLEAR: string;
    WHITE_08: string;
    NEAR_BLACK: string;
    TRANSPARENT: string;
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
    GREEN_10: "rgba(255, 255, 255, 0.10)",
    GREEN_30: "rgba(246, 246, 246, 0.30)",
    GREEN_100: "rgba(4, 41, 11, 1)",
    PALE_GREEN: "rgba(207, 240, 192, 1)",
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

  gredint: {
    GREEN: "rgb(83,186,169)",
    PALE_GREEN: "rgba(207, 240, 192, 1)",
    BLUE: "rgb(59,130,246)",
    LIGHT_BLUE: "rgb(191,219,254)",
    DEEP_GREEN: "rgba(4, 41, 11, 1)",
    RED: "rgb(220,38,38)",
    DARK_BLUE: "rgb(30,58,138)",
    BLACK: "rgb(0,0,0)",
    BLACK_90: "rgba(0,0,0,0.9)",
    CANVAS_BG: "rgb(6,33,15)",
    CARD_BG: "rgba(0,0,0,0.45)",
    CARD_SHADOW: "rgba(0,0,0,0.18)",
    CARD_TINT: "rgba(4,34,14,0.36)",
    OVERLAY_TOP_START: "rgba(3,24,10,0.66)",
    OVERLAY_TOP_MID: "rgba(3,20,9,0.36)",
    OVERLAY_TOP_END: "rgba(3,20,9,0.72)",
    OVERLAY_SIDE_SOLID: "rgba(3,41,12,0.9)",
    OVERLAY_SIDE_MID: "rgba(3,41,12,0.46)",
    OVERLAY_SIDE_FADE: "rgba(3,41,12,0.06)",
    VIGNETTE_INNER: "rgba(0,0,0,0.02)",
    VIGNETTE_OUTER: "rgba(0,0,0,0.42)",
    VIGNETTE_SIDE: "rgba(5,35,14,0.35)",
    VIGNETTE_SIDE_CLEAR: "rgba(5,35,14,0)",
    WHITE_08: "rgba(255,255,255,0.08)",
    NEAR_BLACK: "rgb(6,6,6)",
    TRANSPARENT: "rgba(0,0,0,0)",
  },
};

export default COLORS;
