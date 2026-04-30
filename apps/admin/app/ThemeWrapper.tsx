"use client";

import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ReactNode } from "react";
import theme from "../../../packages/ui/src/theme";

interface ThemeWrapperProps {
  children: ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
