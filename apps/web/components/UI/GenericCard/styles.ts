import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import { shimmer } from "@/utils/animations";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";

export const Card = styled.div<{
  $width?: string;
  $compact?: boolean;
  $coverImage?: boolean;
  $minHeight?: string;
}>`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: ${({ $compact }) => ($compact ? "12px 14px" : "18px 20px")};
  border-radius: ${({ theme }) => theme.radius.lg};
  gap: ${({ $compact }) => ($compact ? "6px" : "8px")};
  align-items: stretch;
  flex: 1 1 auto;
  height: auto;
  min-height: ${({ $compact, $minHeight }) => {
    if ($compact) return "0";
    if ($minHeight) return $minHeight;
    return "0";
  }};
  width: ${({ $width }) => $width || "100%"};
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  transition:
    transform ${({ theme }) => theme.animations.normal}
      ${({ theme }) => theme.animations.easing},
    box-shadow ${({ theme }) => theme.animations.normal}
      ${({ theme }) => theme.animations.easing};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

export const ImageWrapper = styled.div<{
  $compact?: boolean;
  $coverImage?: boolean;
  $isLoading?: boolean;
  $imageAspectRatio?: string;
}>`
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-shrink: 0;
  min-height: ${({ $compact, $coverImage }) => {
    if ($coverImage) return "0";
    if ($compact) return "104px";
    return "190px";
  }};
  aspect-ratio: ${({ $coverImage, $imageAspectRatio }) =>
    $imageAspectRatio ?? ($coverImage ? "650 / 868" : "16 / 9")};

  @supports not (aspect-ratio: 1 / 1) {
    padding-bottom: ${({ $coverImage, $imageAspectRatio }) => {
      if ($imageAspectRatio === "1 / 1") return "100%";
      if ($imageAspectRatio === "25 / 19") return "76%";
      if ($imageAspectRatio) return undefined;
      return $coverImage ? "133.538%" : "56.25%";
    }};
  }

  padding: 0;
  align-items: center;
  align-self: stretch;
  border-radius: ${({ theme }) => theme.radius.lg};
  isolation: isolate;
  background-color: ${({ theme }) => theme.colors.neutral.GRAY_200};

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${({ $isLoading }) => ($isLoading ? 0 : 1)};
    transition:
      opacity 0.3s ease,
      transform 0.6s cubic-bezier(0.25, 1, 0.5, 1) !important;
    object-fit: cover;
    object-position: ${({ $coverImage }) =>
      $coverImage ? "center top" : "center"};
    border-radius: inherit;
  }

  ${media.tablet} {
    padding: ${({ $compact, $coverImage }) =>
      $coverImage || $compact ? "0" : "0"};
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const CardTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const CardChildren = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
`;

export const CardActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${GENERIC_CARD_LAYOUT.ACTIONS_GAP};
  margin-top: auto;
  flex-shrink: 0;
  min-width: 0;
`;

export const Badge = styled.span<{ $variant?: "default" | "owned" }>`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${({ $variant = "default", theme }) =>
    $variant === "owned"
      ? theme.colors.primary.GREEN
      : theme.colors.primary.WHITE};
  padding: 5px 8px;
  border-radius: 5px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background ${({ theme }) => theme.animations.normal}
    ${({ theme }) => theme.animations.easing};

  &:hover,
  ${Card}:has(:is(button, a):hover) & {
    background: ${({ $variant = "default", theme }) =>
      $variant === "owned"
        ? theme.colors.primary.GREEN
        : theme.colors.primary.GREEN_50};
  }
`;

export const ImageSkeleton = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral.GRAY_200} 25%,
    ${({ theme }) => theme.colors.neutral.GRAY_100} 50%,
    ${({ theme }) => theme.colors.neutral.GRAY_200} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite ease-in-out;
`;

export const ImageInitials = styled(MonoText)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gradient.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  user-select: none;
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex-shrink: 0;

  > * {
    flex: 1 0 auto;
    min-width: 0;
  }

  button,
  a {
    height: ${GENERIC_CARD_LAYOUT.ACTION_HEIGHT};
    min-height: ${GENERIC_CARD_LAYOUT.ACTION_HEIGHT};
    padding: 0 12px;
    font-size: ${GENERIC_CARD_LAYOUT.ACTION_FONT_SIZE};
    font-weight: ${GENERIC_CARD_LAYOUT.ACTION_FONT_WEIGHT};
    line-height: 1;
  }
`;
