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
    GREEN_200: string;
    PALE_GREEN: string;
    GRAY: string;
    BLUE: string;
    ORANGE: string;
  };
  secondary: {
    LIGHT: string;
    DEFAULT: string;
    DARK: string;
    main: string;
    muted: string;
    border: string;
    MEDIUM_GREEN: string;
  };
  neutral: {
    WHITE: string;
    OFF_WHITE: string;
    BLACK: string;
    GRAY: string;
    GRAY_100: string;
    GRAY_200: string;
    GRAY_300: string;
    GRAY_400: string;
    GRAY_700: string;
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
    FRAME_BG: string;
    FRAME_BORDER: string;
    FRAME_GLOW: string;
    FRAME_SHADOW: string;
    DEEP_GREEN_80: string;
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
    GREEN_50: "rgba(195,222,181,1)",
    RED: "rgb(220,38,38)",
    GREEN_10: "rgba(255, 255, 255, 0.10)",
    GREEN_30: "rgba(246, 246, 246, 0.30)",
    GREEN_100: "rgba(4, 41, 11, 1)",
    GREEN_200: "rgba(0, 128, 0, 1)",
    PALE_GREEN: "rgba(207, 240, 192, 1)",
    GRAY: "rgba(235, 235, 237, 1)",
    BLUE: "rgba(47, 128, 237, 1)",
    ORANGE: "rgba(255, 140, 66, 1)",
  },

  secondary: {
    LIGHT: "rgb(191,219,254)",
    DEFAULT: "rgb(59,130,246)",
    DARK: "rgb(30,58,138)",
    main: "rgb(17,24,39)",
    muted: "rgb(107,114,128)",
    border: "rgb(243,244,246)",
    MEDIUM_GREEN: "rgba(146, 179, 129, 1)",
  },

  neutral: {
    WHITE: "rgb(255,255,255)",
    OFF_WHITE: "rgba(246, 246, 246, 1)",
    BLACK: "rgb(0,0,0)",
    GRAY: "rgba(6, 6, 6, 0.6)",
    GRAY_100: "rgb(243,244,246)",
    GRAY_200: "rgba(235, 235, 237, 1)",
    GRAY_300: "rgba(0, 0, 0, 0.08)",
    GRAY_400: "rgba(6, 6, 6, 0.5)",
    GRAY_700: "rgb(55,65,81)",
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
    FRAME_BG: "rgba(15, 23, 42, 0.12)",
    FRAME_BORDER: "rgba(15, 23, 42, 0.08)",
    FRAME_GLOW: "rgba(197, 219, 184, 0.22)",
    FRAME_SHADOW: "rgba(67, 87, 59, 0.24)",
    DEEP_GREEN_80: "rgba(4, 41, 11, 0.8)",
    TRANSPARENT: "rgba(0,0,0,0)",
  },
};

export default COLORS;
