import styled from "styled-components";
import { type CSSProperties } from "react";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";
import SafeImage from "@/components/UI/SafeImage";
import { type CtaImageCard } from "@/utils/landingShared";

export const Section = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gredint.CANVAS_BG};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  ${media.desktop} {
    display: none;
  }
`;

export const Card = styled.div<{
  $left?: number;
  $top?: number;
  $width?: number;
  $height?: number;
  $mobileOnly?: boolean;
}>`
  left: ${({ $left = 0 }) => `${$left}%`};
  top: ${({ $top = 0 }) => `${$top}%`};
  width: ${({ $width = 20 }) => `${$width}%`};
  height: ${({ $height = 30 }) => `${$height}%`};
  position: absolute;
  overflow: hidden;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.gredint.CARD_BG};
  box-shadow: 0 8px 24px ${({ theme }) => theme.colors.gredint.CARD_SHADOW};

  ${media.desktop} {
    position: ${({ $mobileOnly }) => ($mobileOnly ? "relative" : "absolute")};
    left: auto;
    top: auto;
    width: ${({ $mobileOnly }) => ($mobileOnly ? "100%" : "18%")};
    height: ${({ $mobileOnly }) => ($mobileOnly ? "114px" : "28%")};
  }
`;

export const MobileBackdrop = styled.div`
  display: none;
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  ${media.desktop} {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }
`;

export const MobileGrid = styled.div`
  width: 114%;
  height: 102%;
  margin-left: -7%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;

  ${media.mobile} {
    width: 118%;
    margin-left: -9%;
  }
`;

export const CardImage = styled(SafeImage).attrs({
  fill: true,
  sizes: "(max-width: 1024px) 50vw, 16vw",
})`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.67) contrast(1.18);
`;

export const CardTint = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.gredint.CARD_TINT};
`;

export const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
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
      ${({ theme }) => theme.colors.gredint.OVERLAY_SIDE_MID} 22%,
      ${({ theme }) => theme.colors.gredint.OVERLAY_SIDE_FADE} 48%,
      ${({ theme }) => theme.colors.gredint.OVERLAY_SIDE_MID} 78%,
      ${({ theme }) => theme.colors.gredint.OVERLAY_SIDE_SOLID} 100%
    );
`;

export const VignetteOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    radial-gradient(
      circle at 50% 45%,
      ${({ theme }) => theme.colors.gredint.VIGNETTE_INNER} 0%,
      ${({ theme }) => theme.colors.gredint.VIGNETTE_OUTER} 100%
    ),
    linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.gredint.VIGNETTE_SIDE} 0%,
      ${({ theme }) => theme.colors.gredint.VIGNETTE_SIDE_CLEAR} 14%,
      ${({ theme }) => theme.colors.gredint.VIGNETTE_SIDE_CLEAR} 86%,
      ${({ theme }) => theme.colors.gredint.VIGNETTE_SIDE} 100%
    );
`;

export const Content = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  width: 1440px;
  height: 593px;
  max-width: 100%;
  margin: 0 auto;
  padding: 120px 429px 120.04px 429px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  box-sizing: border-box;

  ${media.desktopLg} {
    width: 100%;
    height: auto;
    padding: 100px 240px;
  }

  ${media.desktop} {
    width: 100%;
    height: auto;
    padding: 72px 48px;
  }

  ${media.tablet} {
    width: 100%;
    height: auto;
    padding: 64px 24px;
  }
`;

export const Brand = styled.div`
  margin: 0 0 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.tablet} {
    margin-bottom: 32px;
  }
`;

export const BrandLogo = styled.span`
  display: block;
  width: 126px;

  img {
    width: 100%;
    height: auto;
  }

  ${media.tablet} {
    width: 116px;
  }
`;

export const Heading = styled.h1`
  ${({ theme }) => theme.typography.Heading1};
  margin: 0 0 30px;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-align: center;

  ${media.tablet} {
    margin-bottom: 22px;
  }
`;

export const Subtitle = styled.p`
  ${({ theme }) => theme.typography.H4_Medium};
  margin: 0 0 50px;
  max-width: 760px;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-align: center;

  ${media.tablet} {
    max-width: 100%;
    margin-bottom: 32px;
  }
`;

export const CTAButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.LG,
})`
  margin-top: 0;
  border-radius: 8px;
`;

export function getRevealCardStyle(
  card: CtaImageCard,
  mobile: boolean,
): CSSProperties {
  return {
    position: !mobile ? "absolute" : undefined,
    left: !mobile && card.left != null ? `${card.left}%` : undefined,
    top: !mobile && card.top != null ? `${card.top}%` : undefined,
    width: !mobile && card.width != null ? `${card.width}%` : undefined,
    height: !mobile && card.height != null ? `${card.height}%` : undefined,
  };
}

export const callToActionCardStyle: CSSProperties = {
  position: "relative",
  left: "auto",
  top: "auto",
  width: "100%",
  height: "100%",
};
