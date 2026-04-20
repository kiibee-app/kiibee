import styled, { keyframes } from "styled-components";
import { media } from "../../../../../packages/ui/src/breakpoints";
import { LoaderSize, sizeMap } from "@/types/genericLoader";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const Overlay = styled.div<{ $isTransparent?: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background: ${({ $isTransparent, theme }) =>
    $isTransparent ? "transparent" : theme.colors.neutral.OVERLAY};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const Spinner = styled.div<{ $size: LoaderSize }>`
  width: ${({ $size }) => sizeMap[$size].spinner}px;
  height: ${({ $size }) => sizeMap[$size].spinner}px;
  border: ${({ $size }) => sizeMap[$size].border}px solid
    ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-top-color: ${({ theme }) => theme.colors.primary.GREEN};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const Label = styled.span`
  font-family: ${({ theme }) => theme.typography.Body_Regular.fontFamily};
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  animation: ${pulse} 1.6s ease-in-out infinite;

  ${media.mobile} {
    font-size: 0.8125rem;
  }
`;

export const InlineWrapper = styled.div<{ $size: LoaderSize }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  ${Spinner} {
    width: ${({ $size }) => Math.round(sizeMap[$size].spinner * 0.6)}px;
    height: ${({ $size }) => Math.round(sizeMap[$size].spinner * 0.6)}px;
    border-width: ${({ $size }) => Math.max(sizeMap[$size].border - 1, 2)}px;
  }

  ${Label} {
    color: ${({ theme }) => theme.colors.primary.BLACK};
  }
`;

export const FullPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;

  ${Label} {
    color: ${({ theme }) => theme.colors.primary.BLACK};
  }
`;
