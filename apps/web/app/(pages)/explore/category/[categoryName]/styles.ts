"use client";

import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import GenericButton from "@/components/UI/GenericButton";

export const MainContent = styled.div`
  width: min(100%, 1320px);
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${media.tablet} {
    padding: 2rem 1rem 3rem;
  }
`;

export const LayoutGrid = styled.div<{ $showSidebar?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $showSidebar }) =>
    $showSidebar ? "260px minmax(0, 1fr)" : "1fr"};
  gap: 2rem;
  align-items: start;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const FiltersColumn = styled.aside`
  width: 100%;
  max-width: 260px;
  position: sticky;
  top: 100px;
  z-index: 10;

  ${media.tablet} {
    position: static;
    max-width: 100%;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;

  @media (min-width: 1400px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  ${media.desktop} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const ResultsState = styled.div`
  grid-column: 1 / -1;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  border: 1px dashed ${({ theme }) => theme.colors.neutral.GRAY_300};
`;

export const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  width: 100%;
`;

export const LoadMoreButton = styled(GenericButton)`
  min-width: 150px;
  border-radius: 2rem;
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.colors.neutral.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_700};
    transform: translateY(-1px);
  }
`;
