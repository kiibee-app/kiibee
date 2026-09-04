import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

import { GENERIC_CARD_LAYOUT } from "@/utils/ui";

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
  grid-template-columns: ${({ $columnMax, $columns }) => {
    if ($columnMax) {
      return `repeat(auto-fill, minmax(${GENERIC_CARD_LAYOUT.GRID_MIN}, ${$columnMax}))`;
    }
    if ($columns) {
      return `repeat(${$columns}, ${GENERIC_CARD_LAYOUT.WIDTH})`;
    }
    return `repeat(4, ${GENERIC_CARD_LAYOUT.WIDTH})`;
  }};
  gap: ${GENERIC_CARD_LAYOUT.GAP};
  justify-content: start;

  ${media.desktop} {
    grid-template-columns: ${({ $columnMax, $columns }) => {
      if ($columnMax) {
        return `repeat(auto-fill, minmax(${GENERIC_CARD_LAYOUT.GRID_MIN}, ${$columnMax}))`;
      }
      if ($columns) {
        return `repeat(${Math.min($columns, 3)}, ${GENERIC_CARD_LAYOUT.WIDTH})`;
      }
      return `repeat(3, ${GENERIC_CARD_LAYOUT.WIDTH})`;
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
