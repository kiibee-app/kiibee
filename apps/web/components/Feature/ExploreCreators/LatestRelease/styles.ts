import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import GenericButton from "@/components/UI/GenericButton";

export const Section = styled.section`
  width: min(100%, 1320px);
  margin: 0 auto;
  padding: 2.5rem 0 3rem;

  ${media.tablet} {
    width: 100%;
    padding: 2rem 1.25rem 2.5rem;
  }
`;

export const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.35rem;

  ${media.desktopMd} {
    width: 100%;
    padding: 0 25px;
  }

  ${media.desktop} {
    width: 100%;
    padding: 0 25px;
  }

  ${media.tablet} {
    align-items: flex-start;
    padding: 0;
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
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 1rem;
  align-items: start;

  ${media.desktopMd} {
    width: 100%;
    padding: 40px 25px;
  }

  ${media.desktop} {
    width: 100%;
    padding: 40px 25px;
  }

  ${media.tablet} {
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

export const FiltersColumn = styled.aside`
  width: 100%;
  max-width: 260px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: sticky;
  top: 120px;
  z-index: 10;
  height: max-content;

  ${media.tablet} {
    position: static;
    max-width: 100%;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  ${media.desktop} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const CardsColumn = styled.div`
  min-width: 0;
  overflow: hidden;
`;

export const ResultsState = styled.div`
  grid-column: 1 / -1;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
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
