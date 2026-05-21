import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary.GRAY};
  padding: 2.5rem 0;
  box-sizing: border-box;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1440px;
  padding: 0 1.5rem;
  box-sizing: border-box;
  gap: 3.75rem;

  ${media.desktop} {
    flex-direction: column;
    align-items: flex-start;
  }

  ${media.tablet} {
    gap: 1.25rem;
    padding: 0 1rem;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;
  flex: 1;

  ${media.tablet} {
    width: 100%;
    gap: 1.25rem;
  }
`;

export const Heading = styled.h2`
  ${({ theme }) => theme.typography.Heading1};
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  font-family: "Reddit Sans", sans-serif;
  font-style: normal;
  font-weight: 600;
  line-height: 75px;

  ${media.tablet} {
    line-height: 56px;
  }
`;

export const CTAButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.LG,
})`
  align-self: flex-start;
  box-shadow: none;
  transition: opacity 0.2s ease;
`;

export const RightColumn = styled.div`
  display: flex;
  gap: 1.25rem;
  flex: 1.2;
  justify-content: flex-end;

  ${media.desktop} {
    width: 100%;
    justify-content: flex-start;
  }

  ${media.tablet} {
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 0.5rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 0.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

type CardProps = {
  $image: string;
  $isActive?: boolean;
  $narrowBgPosition?: string;
  $narrowBgSize?: string;
};

export const Card = styled.div<CardProps>`
  display: flex;
  width: ${({ $isActive }) => ($isActive ? "498px" : "154px")};
  height: 593px;
  padding: ${({ $isActive }) => ($isActive ? "34px 54px 26px 20px" : "26px 0")};
  flex-direction: column;
  align-items: ${({ $isActive }) => ($isActive ? "flex-start" : "center")};
  gap: 10px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  will-change: transform, width, height, padding;
  box-shadow: 0 0.5rem 1.5rem
    ${({ theme }) => theme.colors.gradient.CARD_SHADOW};
  background: ${({
    $image,
    $isActive,
    theme,
    $narrowBgPosition = "center center",
    $narrowBgSize = "cover",
  }) =>
    `url(${$image}) ${theme.colors.primary.GRAY} ${
      $isActive ? "center center" : $narrowBgPosition
    } / ${$isActive ? "cover" : $narrowBgSize} no-repeat`};

  ${media.desktop} {
    width: min(498px, 100%);
  }

  ${media.tablet} {
    min-width: 96px;
    height: 320px;
    border-radius: 8px;
  }
`;

export const AnimatedCard = styled(Card)`
  flex-shrink: 0;
  cursor: pointer;
`;

export const MainGradientOverlay = styled.div<{ $visible?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.colors.gradient.BLACK_90} 0%,
    ${({ theme }) => theme.colors.gradient.CARD_BG} 40%,
    ${({ theme }) => theme.colors.gradient.TRANSPARENT} 100%
  );
  pointer-events: none;
  opacity: ${({ $visible = true }) => ($visible ? 1 : 0)};
  transition: opacity 0.32s ease;
`;

export const NarrowGradientOverlay = styled.div<{ $visible?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80%;
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.colors.gradient.BLACK_90} 0%,
    ${({ theme }) => theme.colors.gradient.TRANSPARENT} 100%
  );
  pointer-events: none;
  opacity: ${({ $visible = true }) => ($visible ? 1 : 0)};
  transition: opacity 0.32s ease;
`;

export const MainCardTextContainer = styled.div<{ $visible?: boolean }>`
  position: absolute;
  bottom: 1.875rem;
  left: 1.875rem;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  z-index: 2;
  opacity: ${({ $visible = true }) => ($visible ? 1 : 0)};
  transition: opacity 0.28s ease;
  pointer-events: none;
`;

export const MainCardTitle = styled.h3`
  ${({ theme }) => theme.typography.H4_Medium};
  margin: 0 0 0.5rem;
  font-weight: 600;
  letter-spacing: -0.0313rem;
`;

export const MainCardSubtitle = styled.p`
  ${({ theme }) => theme.typography.Body_Medium};
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE_90};
  font-weight: 400;
`;

export const NarrowCardText = styled.p<{ $visible?: boolean }>`
  ${({ theme }) => theme.typography.H4_Medium};
  position: absolute;
  bottom: 1.875rem;
  left: 50%;
  transform-origin: 0 50%;
  transform: rotate(-90deg);
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: -0.0313rem;
  z-index: 2;
  margin: 0;
  opacity: ${({ $visible = true }) => ($visible ? 1 : 0)};
  transition: opacity 0.28s ease;
  pointer-events: none;

  ${media.tablet} {
    bottom: 1rem;
  }
`;
