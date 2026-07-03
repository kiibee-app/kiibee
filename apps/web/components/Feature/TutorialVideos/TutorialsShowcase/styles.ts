import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Grid = styled.div<{
  $maxWidth?: string;
  $columnMax?: string;
  $columns?: number;
}>`
  width: 100%;
  max-width: ${({ $maxWidth, $columnMax, $columns }) =>
    $maxWidth ?? ($columnMax ? "100%" : $columns ? "1300px" : "1300px")};
  margin: 0 auto;
  display: grid;
  grid-template-columns: ${({ $columnMax, $columns }) => {
    if ($columnMax) {
      return `repeat(auto-fill, minmax(260px, ${$columnMax}))`;
    }
    if ($columns) {
      return `repeat(${$columns}, minmax(0, 1fr))`;
    }
    return "repeat(4, minmax(0, 1fr))";
  }};
  gap: ${({ $columnMax }) => ($columnMax ? "1.25rem" : "20px")};
  justify-content: center;

  ${media.desktop} {
    grid-template-columns: ${({ $columnMax, $columns }) => {
      if ($columnMax) {
        return `repeat(auto-fill, minmax(260px, ${$columnMax}))`;
      }
      if ($columns) {
        return `repeat(${Math.min($columns, 3)}, minmax(0, 1fr))`;
      }
      return "repeat(3, minmax(0, 1fr))";
    }};
  }

  ${media.tablet} {
    grid-template-columns: ${({ $columnMax, $columns }) => {
      if ($columnMax) return "1fr";
      if ($columns) return "repeat(2, minmax(0, 1fr))";
      return "repeat(2, minmax(0, 1fr))";
    }};
  }

  ${media.mobileLg} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;
