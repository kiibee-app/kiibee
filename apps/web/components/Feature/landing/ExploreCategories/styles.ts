import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.GRAY};
  padding: clamp(2.5rem, 8vw, 5rem) clamp(1rem, 4vw, 1.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: center;
`;

export const Subtitle = styled.p`
  margin: 0;
  max-width: 600px;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: clamp(2.5rem, 6vw, 3.75rem);
  width: 100%;
  max-width: 800px;
`;

export const FilterPill = styled.button<{ $active: boolean }>`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.neutral.BLACK : theme.colors.neutral.WHITE};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.neutral.BLACK : theme.colors.neutral.GRAY_300};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.neutral.WHITE : theme.colors.primary.BLACK_90};
  border-radius: 999px;
  padding: 0.5rem 1.125rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  span,
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: inherit;
  }

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.neutral.BLACK : theme.colors.neutral.GRAY_100};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 2px;
  }
`;

export const GridContainer = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto clamp(2rem, 5vw, 3rem);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  ${media.desktopMd} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.desktopSm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.mobileMd} {
    grid-template-columns: 1fr;
  }
`;

export const BottomCtaSection = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const BrowseAllButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.MD,
})`
  background: ${({ theme }) => theme.colors.neutral.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 6px;
  font-weight: 600;
  padding: 0.75rem 2rem;
  box-shadow: ${({ theme }) => theme.shadows.md};

  span,
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: inherit;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_700};
    opacity: 0.9;
  }
`;
