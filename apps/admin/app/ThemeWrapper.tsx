"use client";

import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme } from "@repo/ui/theme";
import { ReactNode } from "react";

interface ThemeWrapperProps {
  children: ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <StyledThemeProvider theme={lightTheme}>{children}</StyledThemeProvider>
  );
}
