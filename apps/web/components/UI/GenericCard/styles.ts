import { media } from "@repo/ui/breakpoints";
import styled, { css } from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import { pulse } from "@/utils/animations";

export const Card = styled.div<{
  $width?: string;
  $compact?: boolean;
  $coverImage?: boolean;
}>`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: ${({ $compact }) => ($compact ? "12px 14px" : "18px 20px")};
  border-radius: ${({ theme }) => theme.radius.lg};
  gap: ${({ $compact }) => ($compact ? "6px" : "8px")};
  align-items: stretch;
  height: 100%;
  min-height: ${({ $compact, $coverImage }) => {
    if ($compact) return "0";
    if ($coverImage) return "300px";
    return "315px";
  }};
  width: ${({ $width }) => $width || "100%"};
  box-shadow: ${({ theme }) => theme.shadows.frame};
  transition:
    transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);

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
}>`
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  min-height: ${({ $compact, $coverImage }) => {
    if ($coverImage) return "220px";
    if ($compact) return "104px";
    return "190px";
  }};
  aspect-ratio: ${({ $coverImage }) => ($coverImage ? "1 / 1" : "16 / 9")};

  @supports not (aspect-ratio: 1 / 1) {
    padding-bottom: ${({ $coverImage }) => ($coverImage ? "100%" : "56.25%")};
  }

  padding: ${({ $compact, $coverImage }) =>
    $coverImage || $compact ? "0" : "12px 178px 154px 10px"};
  align-items: center;
  align-self: stretch;
  border-radius: ${({ theme }) => `${theme.radius.lg} ${theme.radius.lg} 0 0`};
  background-color: ${({ theme }) => theme.colors.neutral.GRAY_200};

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      animation: ${pulse} 1.5s ease-in-out infinite;
    `}

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1) !important;
    object-fit: cover;
    object-position: ${({ $coverImage }) =>
      $coverImage ? "center top" : "center"};
  }

  ${media.tablet} {
    min-height: ${({ $coverImage }) => ($coverImage ? "200px" : undefined)};
    padding: ${({ $compact, $coverImage }) =>
      $coverImage || $compact ? "0" : "0"};
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
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
  &:hover {
    background: ${({ $variant = "default", theme }) =>
      $variant === "owned"
        ? theme.colors.primary.GREEN
        : theme.colors.primary.GREEN_50};
  }
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
  gap: 0.5rem;
  flex-wrap: wrap;

  > * {
    flex: 1;
    min-width: 0;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CardChildren = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
`;
