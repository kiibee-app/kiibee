import styled from "styled-components";
import { media } from "@kiibee/ui/breakpoints";

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
  min-height: 43rem;
  overflow: hidden;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.5rem 2rem;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.gredint.CANVAS_BG};

  ${media.tablet} {
    min-height: auto;
    padding: 3rem 1rem;
    border-radius: 0.5rem;
  }
`;

export const BackgroundImage = styled.div<{ $image: string }>`
  position: absolute;
  inset: 0;
  background: url(${({ $image }) => $image}) center center / cover no-repeat;
`;

export const GradientOverlay = styled.div`
  position: absolute;
  opacity: 0;
  background:
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.gredint.OVERLAY_TOP_START} 0%,
      ${({ theme }) => theme.colors.gredint.OVERLAY_TOP_MID} 45%,
      ${({ theme }) => theme.colors.gredint.OVERLAY_TOP_END} 100%
    ),
    linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.gredint.OVERLAY_SIDE_SOLID} 0%,
      ${({ theme }) => theme.colors.gredint.OVERLAY_SIDE_MID} 18%,
      ${({ theme }) => theme.colors.gredint.OVERLAY_SIDE_FADE} 50%,
      ${({ theme }) => theme.colors.gredint.OVERLAY_SIDE_MID} 82%,
      ${({ theme }) => theme.colors.gredint.OVERLAY_SIDE_SOLID} 100%
    );
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 77.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  ${media.tablet} {
    gap: 1.5rem;
  }
`;

export const Heading = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-align: center;
  ${({ theme }) => theme.typography.Heading2};
  line-height: 1.2;
`;

export const Panel = styled.div`
  width: 100%;
  padding: 2rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary.GREEN_50};
  box-sizing: border-box;

  ${media.tablet} {
    padding: 1.5rem 1rem;
  }
`;

export const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.5rem;

  ${media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }
`;

export const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BulletItem = styled.li`
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  ${({ theme }) => theme.typography.Body_Regular};
  line-height: 1.6;

  &::marker {
    color: ${({ theme }) => theme.colors.primary.GREEN_100};
  }
`;
