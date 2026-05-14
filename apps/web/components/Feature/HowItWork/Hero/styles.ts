import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Hero = styled.section`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  min-height: 90vh;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
  }
`;

export const Background = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: -72px;
  height: calc(100% + 72px);
  z-index: 0;
  overflow: hidden;
`;

export const Inner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${media.tablet} {
    padding: 3rem 1.25rem;
    align-items: center;
    justify-content: center;
  }
`;

export const Content = styled.div`
  max-width: 750px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.neutral.BLACK};

  align-items: flex-start;
  text-align: left;

  ${media.tablet} {
    align-items: center;
    text-align: center;
  }
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.Heading1};
  margin: 0 0 0.75rem 0;

  ${media.tablet} {
    max-width: 100%;
  }
`;

export const Subtitle = styled.p`
  ${({ theme }) => theme.typography.H4_Medium};
  margin: 0 0 1.25rem 0;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  max-width: 500px;

  ${media.tablet} {
    max-width: 100%;
  }
`;

export const CTAWrap = styled.div``;
