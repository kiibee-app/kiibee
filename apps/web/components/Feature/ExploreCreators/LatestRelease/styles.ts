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
`;

export const HeaderTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
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

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const FiltersColumn = styled.aside`
  width: 100%;
  max-width: 260px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
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
