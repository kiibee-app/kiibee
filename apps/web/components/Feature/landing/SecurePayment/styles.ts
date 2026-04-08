import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  padding: 3rem 0;
`;

export const SectionInner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3rem);

  ${media.desktop} {
    padding: 0 1.5rem;
    grid-template-columns: 1fr;
  }

  ${media.tablet} {
    padding: 0 1rem;
  }
`;

export const TextColumn = styled.div`
  max-width: 38rem;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
  font-size: clamp(2.5rem, 4.6vw, 4.3rem);
`;

export const Description = styled.p`
  margin: 3.3rem 0 0 0;
  max-width: 34rem;
  color: ${({ theme }) => theme.colors.primary.WHITE_90};
  font-size: 18px;
  width: 435px;
  line-height: 1.55;

  ${media.tablet} {
    width: 100%;
    margin: 1.5rem 0 0 0;
  }
`;

export const ImageColumn = styled.div`
  width: 100%;
  display: grid;
  gap: 1.5rem;
`;

const ImageBox = styled.div`
  position: relative;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
`;

export const HeroImageWrap = styled(ImageBox)`
  aspect-ratio: 16 / 9;
`;

export const ImageCard = styled(ImageBox)`
  aspect-ratio: 16 / 9;
`;
