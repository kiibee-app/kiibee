import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const Card = styled.div<{
  $width?: string;
  $compact?: boolean;
}>`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: ${({ $compact }) => ($compact ? "12px 14px" : "18px 20px")};
  border-radius: 12px;
  gap: ${({ $compact }) => ($compact ? "6px" : "8px")};
  align-items: stretch;
  min-height: ${({ $compact }) => ($compact ? "0" : "315px")};
  width: ${({ $width }) => $width || "100%"};
  box-shadow: 0 0 10.483px 0 ${({ theme }) => theme.colors.gredint.CARD_SHADOW};
`;

export const ImageWrapper = styled.div<{ $compact?: boolean }>`
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  min-height: ${({ $compact }) => ($compact ? "104px" : "190px")};
  padding: ${({ $compact }) => ($compact ? "0" : "12px 178px 154px 10px")};
  align-items: center;
  align-self: stretch;
  border-radius: 12px 12px 0 0;
  ${media.tablet} {
    padding: ${({ $compact }) => ($compact ? "0" : "0")};
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
