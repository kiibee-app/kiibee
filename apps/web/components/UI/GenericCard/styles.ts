import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

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
  border-radius: 12px;
  gap: ${({ $compact }) => ($compact ? "6px" : "8px")};
  align-items: stretch;
  min-height: ${({ $compact, $coverImage }) => {
    if ($compact) return "0";
    if ($coverImage) return "280px";
    return "315px";
  }};
  width: ${({ $width }) => $width || "100%"};
  box-shadow: 0 0 10.483px 0 ${({ theme }) => theme.colors.neutral.GRAY_300};
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px ${({ theme }) => theme.colors.gradient.CARD_SHADOW};
  }
`;

export const ImageWrapper = styled.div<{
  $compact?: boolean;
  $coverImage?: boolean;
}>`
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  min-height: ${({ $compact, $coverImage }) => {
    if ($coverImage) return "200px";
    if ($compact) return "104px";
    return "190px";
  }};
  aspect-ratio: ${({ $coverImage }) => ($coverImage ? "5 / 4" : "auto")};
  padding: ${({ $compact, $coverImage }) =>
    $coverImage || $compact ? "0" : "12px 178px 154px 10px"};
  align-items: center;
  align-self: stretch;
  border-radius: 12px 12px 0 0;

  ${media.tablet} {
    min-height: ${({ $coverImage }) => ($coverImage ? "180px" : undefined)};
    padding: ${({ $compact, $coverImage }) =>
      $coverImage || $compact ? "0" : "0"};
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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
