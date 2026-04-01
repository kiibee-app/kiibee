"use client";

import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { Theme } from "@repo/ui/theme/types";
import { ReactNode } from "react";

interface ThemeWrapperProps {
  children: ReactNode;
}

const defaultTheme: Theme = {
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

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <StyledThemeProvider theme={defaultTheme}>{children}</StyledThemeProvider>
  );
}
