import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { exploreSectionFrame } from "@/styles/exploreCardGrid";

export const Section = styled.section`
  ${exploreSectionFrame}
  padding-top: 30px;
  padding-bottom: 40px;

  ${media.desktopMd} {
    padding-top: 40px;
    padding-bottom: 72px;
  }

  ${media.tablet} {
    padding-top: 30px;
    padding-bottom: 48px;
  }
`;

export const Content = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const SectionTag = styled.span`
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
`;

export const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

export const SectionArrows = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 1rem;
`;

export const SectionArrow = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  transition: opacity 120ms ease;

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
    cursor: not-allowed;
    opacity: 1;
    pointer-events: none;
  }
`;
