import { css } from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";

export const fluidCardColumns = (columns: number) =>
  `repeat(${columns}, minmax(0, 1fr))`;

export const exploreSectionFrame = css`
  box-sizing: border-box;
  width: min(100%, calc(${GENERIC_CARD_LAYOUT.CONTENT_WIDTH} + 48px));
  margin: 0 auto;
  padding-inline: 24px;

  ${media.tablet} {
    width: 100%;
    padding-inline: 16px;
  }
`;

export const exploreCardsGrid = (
  maxColumns = 4,
  options?: { collapseAtDesktopLg?: boolean },
) => css`
  display: grid;
  width: 100%;
  min-width: 0;
  gap: ${GENERIC_CARD_LAYOUT.GAP};
  justify-content: stretch;
  grid-template-columns: ${fluidCardColumns(maxColumns)};

  > * {
    min-width: 0;
  }

  ${options?.collapseAtDesktopLg !== false
    ? css`
        ${media.desktopLg} {
          grid-template-columns: ${fluidCardColumns(Math.min(maxColumns, 3))};
        }
      `
    : ""}

  ${media.desktop} {
    grid-template-columns: ${fluidCardColumns(Math.min(maxColumns, 2))};
  }

  ${media.tablet} {
    grid-template-columns: ${fluidCardColumns(Math.min(maxColumns, 2))};
  }

  ${media.mobileLg} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;
