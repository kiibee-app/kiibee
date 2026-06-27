import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { alpha } from "@/utils/common";

const IMAGE_ASPECT = 4096 / 2731;
const MAX_SECTION_HEIGHT = 760;
const MIN_SECTION_HEIGHT = 580;
const FIGMA_WIDTH = 1441;

export const Section = styled.section`
  position: relative;
  width: 100%;
  height: clamp(
    ${MIN_SECTION_HEIGHT}px,
    calc(100vw / ${IMAGE_ASPECT}),
    ${MAX_SECTION_HEIGHT}px
  );
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gradient.CANVAS_BG};
`;

export const SlideWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Background = styled.div<{
  $src: string;
  $bgPosition?: string;
  $bgPositionMobile?: string;
}>`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: ${({ $bgPosition }) => $bgPosition || "center"};
  background-repeat: no-repeat;

  ${media.desktop} {
    background-position: ${({ $bgPositionMobile }) =>
      $bgPositionMobile || "center"};
  }
`;

export const SectionInner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: ${FIGMA_WIDTH}px;
  height: 100%;
  margin: 0 auto;

  ${media.desktop} {
    padding: 0 1rem;
  }
`;

export const Card = styled.div`
  position: absolute;
  top: clamp(60px, 10.4vw, 150px);
  right: clamp(24px, 16.7vw, 240px);
  display: flex;
  width: min(506px, calc(100% - clamp(48px, 32vw, 480px)));
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
  border-radius: 20px;
  background: ${({ theme }) => alpha(theme.colors.primary.WHITE, 0.42)};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => alpha(theme.colors.primary.WHITE, 0.35)};
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;

  ${media.desktop} {
    left: 50%;
    right: auto;
    top: auto;
    bottom: 48px;
    width: min(506px, calc(100% - 2rem));
    padding: 1.5rem;
    gap: 1.25rem;
    transform: translateX(-50%);
    align-items: center;
    text-align: center;
  }
`;

export const Quote = styled.p`
  margin: 0;
  font-size: clamp(1rem, 1.25vw, 1.125rem);
  line-height: 1.55;
  font-weight: 500;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Author = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;
