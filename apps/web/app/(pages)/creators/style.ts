import styled from "styled-components";
import { media } from "../../../../../packages/ui/src/breakpoints";

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
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;
  flex: 1;
`;

export const Heading = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  font-family: "Reddit Sans", sans-serif;
  font-size: 64px;
  font-style: normal;
  font-weight: 600;
  line-height: 75px;
`;

export const CTAButton = styled.button`
  display: inline-flex;
  height: 49px;
  padding: 14px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.primary.BLACK_90};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  border: none;
  border-radius: 8px;
  font-family: "Reddit Sans", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
  width: auto;
  align-self: flex-start;
  box-shadow: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
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
    flex-direction: column;
    gap: 0.75rem;
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
  box-shadow: 0 0.5rem 1.5rem ${({ theme }) => theme.colors.gredint.CARD_SHADOW};
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
    ${({ theme }) => theme.colors.gredint.BLACK_90} 0%,
    ${({ theme }) => theme.colors.gredint.CARD_BG} 40%,
    ${({ theme }) => theme.colors.gredint.TRANSPARENT} 100%
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
    ${({ theme }) => theme.colors.gredint.BLACK_90} 0%,
    ${({ theme }) => theme.colors.gredint.TRANSPARENT} 100%
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
  margin: 0 0 0.5rem;
  font-size: 1.625rem;
  font-weight: 600;
  letter-spacing: -0.0313rem;
`;

export const MainCardSubtitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.primary.WHITE_90};
  font-weight: 400;
`;

export const NarrowCardText = styled.p<{ $visible?: boolean }>`
  position: absolute;
  bottom: 1.875rem;
  left: 50%;
  transform-origin: 0 50%;
  transform: rotate(-90deg);
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-size: 1.375rem;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: -0.0313rem;
  z-index: 2;
  margin: 0;
  opacity: ${({ $visible = true }) => ($visible ? 1 : 0)};
  transition: opacity 0.28s ease;
  pointer-events: none;

  ${media.tablet} {
    font-size: 1rem;
  }
`;
