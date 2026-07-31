import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 1.5rem 6.5625rem;
  box-sizing: border-box;

  ${media.tablet} {
    padding: 0 1rem 2.5rem;
  }
`;

export const SectionInner = styled.div`
  position: relative;
  width: 100%;
  max-width: 1440px;
  min-height: 49.375rem;
  overflow: hidden;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem clamp(2rem, 7.65vw, 6.875rem);
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.gradient.CANVAS_BG};

  ${media.tablet} {
    min-height: auto;
    padding: 3.5rem 1rem;
    border-radius: 0.5rem;
  }
`;

export const BackgroundImage = styled.div<{ $image: string }>`
  position: absolute;
  inset: 0;
  background: url(${({ $image }) => $image}) center center / cover no-repeat;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.75rem;

  ${media.tablet} {
    gap: 2rem;
  }
`;

export const Heading = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-align: center;
  ${({ theme }) => theme.typography.Heading2};
  line-height: 1.2;
`;

export const FeatureGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  ${media.desktopSm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobileXl} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const FeatureCard = styled.article`
  height: 12.75rem;
  padding: 1.875rem;
  border-radius: 0.5rem;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};

  ${media.desktop} {
    height: auto;
    min-height: 11rem;
  }

  ${media.tablet} {
    min-height: 10rem;
    padding: 1.5rem;
  }
`;

export const FeatureCardContent = styled.div`
  width: 100%;
`;

export const IconSlot = styled.div`
  height: 2.5rem;
  display: flex;
  align-items: center;
  line-height: 0;
`;

export const FeatureTitle = styled.h3`
  margin: 0.875rem 0 0;
  color: inherit;
  ${({ theme }) => theme.typography.H4_Medium};
  line-height: 1.2;
`;

export const FeatureDescription = styled.p`
  margin: 0.75rem 0 0;
  color: inherit;
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.4;
`;
