import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

import { GENERIC_CARD_LAYOUT } from "@/utils/ui";
import { fluidCardColumns } from "@/styles/exploreCardGrid";

export const Grid = styled.div<{
  $maxWidth?: string;
  $columnMax?: string;
  $columns?: number;
}>`
  width: 100%;
  max-width: ${({ $maxWidth }) =>
    $maxWidth ?? GENERIC_CARD_LAYOUT.CONTENT_WIDTH};
  margin: 0 auto;
  display: grid;
  min-width: 0;
  grid-template-columns: ${({ $columnMax, $columns }) => {
    if ($columnMax) {
      return `repeat(auto-fill, minmax(min(100%, ${GENERIC_CARD_LAYOUT.GRID_MIN}), ${$columnMax}))`;
    }
    if ($columns) {
      return fluidCardColumns($columns);
    }
    return fluidCardColumns(4);
  }};
  gap: ${GENERIC_CARD_LAYOUT.GAP};
  justify-content: stretch;

  > * {
    min-width: 0;
  }

  ${media.desktop} {
    grid-template-columns: ${({ $columnMax, $columns }) => {
      if ($columnMax) {
        return `repeat(auto-fill, minmax(min(100%, ${GENERIC_CARD_LAYOUT.GRID_MIN}), ${$columnMax}))`;
      }
      if ($columns) {
        return fluidCardColumns(Math.min($columns, 3));
      }
      return fluidCardColumns(3);
    }};
  }

  ${media.tablet} {
    grid-template-columns: ${({ $columnMax, $columns }) => {
      if ($columnMax) return "1fr";
      if ($columns) return fluidCardColumns(Math.min($columns, 2));
      return fluidCardColumns(2);
    }};
  }

  ${media.mobileLg} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;
