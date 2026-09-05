import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import GenericButton from "@/components/UI/GenericButton";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";
import {
  exploreCardsGrid,
  exploreSectionFrame,
} from "@/styles/exploreCardGrid";

export const Section = styled.section`
  ${exploreSectionFrame}
  padding-top: 2.5rem;
  padding-bottom: 3rem;

  ${media.tablet} {
    padding-top: 2rem;
    padding-bottom: 2.5rem;
  }
`;

export const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.35rem;

  ${media.tablet} {
    align-items: flex-start;
  }
`;

export const HeaderTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;

  ${media.desktopLg} {
    gap: 2rem;
  }

  ${media.desktopMd} {
    gap: 1.75rem;
  }

  ${media.desktop} {
    gap: 1.5rem;
  }

  ${media.tablet} {
    gap: 0.5rem;
  }
`;

export const TabButton = styled(GenericButton)<{ $active?: boolean }>`
  min-height: 0;
  padding: 0.38rem 0.72rem;
  border-radius: 0.55rem;
  box-shadow: none;
  transform: none;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.neutral.WHITE : theme.colors.primary.BLACK};

  & * {
    color: inherit;
  }

  ${({ $active, theme }) =>
    !$active
      ? `
    background: transparent;
    border-color: transparent;
    color: ${theme.colors.primary.BLACK};
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  `
      : ""}
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: ${GENERIC_CARD_LAYOUT.FILTERS_WIDTH} minmax(0, 1fr);
  column-gap: ${GENERIC_CARD_LAYOUT.FILTERS_GAP};
  row-gap: 1rem;
  align-items: start;
  min-width: 0;

  ${media.desktopSm} {
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
  }
`;

export const FiltersColumn = styled.aside`
  width: 100%;
  max-width: ${GENERIC_CARD_LAYOUT.FILTERS_WIDTH};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  position: sticky;
  top: 120px;
  z-index: 10;
  height: max-content;

  ${media.desktopSm} {
    position: static;
    max-width: 100%;
  }
`;

export const CardsGrid = styled.div`
  ${exploreCardsGrid(3, { collapseAtDesktopLg: false })}
`;

export const CardsColumn = styled.div`
  min-width: 0;
`;

export const ResultsState = styled.div`
  grid-column: 1 / -1;
  width: 100%;
`;

export const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.25rem;
  width: 100%;
`;

export const LoadMoreButton = styled(GenericButton)`
  width: 160px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.neutral.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_700};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }
`;
