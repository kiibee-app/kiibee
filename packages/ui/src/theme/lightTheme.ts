import { Theme } from "./types";

export const lightTheme: Theme = {
  name: "light",
  colors: {
    brand: {
      dark: "#045A54",
      light: "#10B981",
      lightest: "#E6F9F0",
    },
    text: {
      main: "#111827",
      muted: "#6B7280",
    },
    border: "#E5E7EB",
    bg: {
      app: "#F9FAFB",
      white: "#FFFFFF",
      browser: "#F3F4F6",
    },
  },
};

export const darkTheme: Theme = {
  name: "dark",
  colors: {
    brand: {
      dark: "#065F46",
      light: "#34D399",
      lightest: "#064E3B",
    },
    text: {
      main: "#F9FAFB",
      muted: "#9CA3AF",
    },
    border: "#374151",
    bg: {
      app: "#111827",
      white: "#1F2937",
      browser: "#1F2937",
    },
  },
};
