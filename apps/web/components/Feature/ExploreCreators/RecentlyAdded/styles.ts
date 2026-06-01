import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: min(100%, 1300px);
  margin: 0 auto;
  padding: 40px 0;

  ${media.tablet} {
    width: 100%;
    padding: 2rem 1.25rem;
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
  padding: 0.35rem 0.75rem;
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
    opacity: 0.35;
    cursor: not-allowed;
  }
`;
