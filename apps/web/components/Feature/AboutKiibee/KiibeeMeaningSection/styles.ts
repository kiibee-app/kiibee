import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const SectionWrapper = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 0 1.25rem 5rem;
`;

export const Inner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1.25rem;
`;

export const Container = styled.div`
  max-width: 1218px;
  width: 100%;
  margin: 0 auto;
`;

export const MeaningBox = styled.aside`
  position: relative;
  max-width: 640px;
  padding: 2rem 2.25rem 2.125rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  border: 1px solid ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: ${({ theme }) => theme.colors.primary.GREEN};
  }

  ${media.tablet} {
    max-width: 100%;
    padding: 1.5rem 1.5rem 1.375rem;
  }
`;

export const Title = styled.h3`
  margin: 0 0 0.875rem;
`;

export const Body = styled.p`
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin: 0;
  line-height: 1.6;
  max-width: 52ch;
`;

export const BrandHighlight = styled.span`
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  font-weight: 600;
`;
