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
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  align-items: center;
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0 0 0.75rem 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const Subtitle = styled.p`
  margin: 0 0 1.25rem 0;
  max-width: 57rem;
  color: ${({ theme }) => theme.colors.primary.WHITE};

  ${media.tablet} {
    max-width: 100%;
    font-size: 1rem;
  }
`;

export const CTAWrap = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;
