"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.6);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const SpinnerOverlay = styled.div<{
  $isOverlay?: boolean;
  $isLocal?: boolean;
  $blurAmount: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  ${({ $isOverlay, $isLocal, $blurAmount }) => {
    if ($isOverlay) {
      return `
        position: fixed;
        inset: 0;
        z-index: 9999;
        background-color: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(${$blurAmount});
        -webkit-backdrop-filter: blur(${$blurAmount});
      `;
    }
    if ($isLocal) {
      return `
        position: absolute;
        inset: 0;
        z-index: 50;
        background-color: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(${$blurAmount});
        -webkit-backdrop-filter: blur(${$blurAmount});
      `;
    }
    return `
      width: 100%;
      height: 100%;
      min-height: 150px;
    `;
  }}
`;

const SpinnerContainer = styled.div<{ $size: number }>`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  animation: ${rotate} 1.2s linear infinite;
`;

const DotWrapper = styled.div<{ $angle: number; $spinnerSize: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $spinnerSize }) =>
    Math.max(4, Math.round($spinnerSize * 0.16))}px;
  height: ${({ $spinnerSize }) =>
    Math.max(4, Math.round($spinnerSize * 0.16))}px;
  margin-top: ${({ $spinnerSize }) =>
    -Math.max(2, Math.round($spinnerSize * 0.08))}px;
  margin-left: ${({ $spinnerSize }) =>
    -Math.max(2, Math.round($spinnerSize * 0.08))}px;
  transform: rotate(${({ $angle }) => $angle}deg)
    translate(0, -${({ $spinnerSize }) => Math.round($spinnerSize * 0.35)}px);
`;

const Dot = styled.div<{ $opacity: number; $scale: number; $color?: string }>`
  width: 100%;
  height: 100%;
  background-color: ${({ $color, theme }) =>
    $color || theme.colors.primary.GREEN};
  border-radius: 50%;
  opacity: ${({ $opacity }) => $opacity};
  transform: scale(${({ $scale }) => $scale});

  animation: ${pulse} 1.2s infinite ease-in-out;
  animation-delay: -${({ $opacity }) => (1 - $opacity) * 1.2}s;
`;

const Label = styled.span<{ $color?: string }>`
  font-family: ${({ theme }) =>
    theme.typography?.Body_Regular?.fontFamily || "sans-serif"};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $color, theme }) => $color || theme.colors.primary.GREEN};
`;

interface GenericSpinnerProps {
  size?: number;
  isOverlay?: boolean;
  isLocal?: boolean;
  blurAmount?: string;
  label?: string;
  color?: string;
  className?: string;
}

export default function GenericSpinner({
  size = 48,
  isOverlay = false,
  isLocal = false,
  blurAmount = "8px",
  label,
  color,
  className,
}: GenericSpinnerProps) {
  const dots = Array.from({ length: 8 }, (_, i) => {
    const angle = i * 45;
    const opacity = 1 - i * 0.1;
    const scale = 1 - i * 0.07;
    return (
      <DotWrapper key={i} $angle={angle} $spinnerSize={size}>
        <Dot $opacity={opacity} $scale={scale} $color={color} />
      </DotWrapper>
    );
  });

  return (
    <SpinnerOverlay
      $isOverlay={isOverlay}
      $isLocal={isLocal}
      $blurAmount={blurAmount}
      className={className}
      role="status"
      aria-label={label || "Loading"}
    >
      <SpinnerContainer $size={size}>{dots}</SpinnerContainer>
      {label && <Label $color={color}>{label}</Label>}
    </SpinnerOverlay>
  );
}
