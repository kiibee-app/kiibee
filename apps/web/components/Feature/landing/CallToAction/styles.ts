import styled from "styled-components";
import { type CSSProperties } from "react";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";
import SafeImage from "@/components/UI/SafeImage";
import { type CtaImageCard } from "@/utils/landingShared";
import { CTA_CARD } from "@/utils/Constants";

export const Section = styled.section`
  position: relative;
  width: 100%;
  max-width: none;
  align-self: stretch;
  height: 75vh;
  min-height: 560px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gradient.CANVAS_BG};
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
  background: ${({ theme }) => theme.colors.gradient.CARD_BG};
  box-shadow: 0 8px 24px ${({ theme }) => theme.colors.gradient.CARD_SHADOW};

  ${media.desktop} {
    position: ${({ $mobileOnly }) => ($mobileOnly ? "relative" : "absolute")};
    left: auto;
    top: auto;
    width: ${({ $mobileOnly }) => ($mobileOnly ? "100%" : "18%")};
    height: ${({ $mobileOnly }) => ($mobileOnly ? "100%" : "28%")};
    min-height: ${({ $mobileOnly }) => ($mobileOnly ? "120px" : "0")};
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
    align-items: stretch;
    justify-content: center;
    padding: 8px;
  }
`;

export const MobileGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(0, 1fr));
  gap: 6px;

  > * {
    min-width: 0;
    min-height: 0;
    height: 100%;
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
  filter: brightness(0.85) contrast(1.08);
`;

export const CardTint = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(4, 41, 11, 0.2);
`;

export const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(4, 41, 11, 1) 0%,
    rgba(4, 41, 11, 0.7) 50%,
    rgba(4, 41, 11, 1) 100%
  );
`;

export const VignetteOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: transparent;
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
    width: 96px;
  }
`;

export const Heading = styled.h1`
  ${({ theme }) => theme.typography.Heading1};
  margin: 0 0 30px;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-align: center;

  ${media.tablet} {
    margin-bottom: 22px;

    > * {
      ${({ theme }) => theme.typography.Heading2};
    }
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

    > * {
      ${({ theme }) => theme.typography.Body_Regular};
    }
  }
`;

export const CTAButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.LG,
})`
  margin-top: 0;
  border-radius: 8px;
  padding: 12px 24px;

  &:not([type="submit"]):hover {
    color: ${({ theme }) => theme.colors.primary.WHITE};
    border-color: ${({ theme }) => theme.colors.primary.WHITE};
  }
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
  minHeight: "100%",
};
