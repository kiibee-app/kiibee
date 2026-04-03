"use client";

import { ThemeProvider as StyledThemeProvider } from "styled-components";
import theme from "../../../packages/ui/src/theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}

export default ThemeProvider;
