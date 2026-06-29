import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { alpha } from "@/utils/common";
import {
  CarouselTransitionType,
  CAROUSEL_TRANSITION_TYPES,
} from "@/utils/Constants";

export const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
`;

export const SlideTrack = styled.div<{
  $transitionType: CarouselTransitionType;
  $activeIndex: number;
}>`
  position: relative;
  width: 100%;
  height: 100%;

  ${({ $transitionType, $activeIndex }) =>
    $transitionType === CAROUSEL_TRANSITION_TYPES.SLIDE &&
    `
    display: flex;
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    transform: translateX(-${$activeIndex * 100}%);
  `}
`;

export const Slide = styled.div<{
  $transitionType: CarouselTransitionType;
  $active: boolean;
}>`
  width: 100%;
  height: 100%;
  flex-shrink: 0;

  ${({ $transitionType, $active }) =>
    $transitionType === CAROUSEL_TRANSITION_TYPES.FADE
      ? `
    position: absolute;
    inset: 0;
    opacity: ${$active ? 1 : 0};
    pointer-events: ${$active ? "auto" : "none"};
    z-index: ${$active ? 2 : 1};
    transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  `
      : `
    position: relative;
  `}
`;

export const NavigationArrow = styled.button<{ $direction: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${({ $direction }) =>
    $direction === "left" ? "left: 40px;" : "right: 40px;"}
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => alpha(theme.colors.primary.WHITE, 0.15)};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => alpha(theme.colors.primary.WHITE, 0.25)};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  outline: none;
  padding: 0;

  &:hover {
    background: ${({ theme }) => alpha(theme.colors.primary.WHITE, 0.3)};
    border-color: ${({ theme }) => alpha(theme.colors.primary.WHITE, 0.4)};
    transform: translateY(-50%) scale(1.08);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px
      ${({ theme }) => alpha(theme.colors.primary.WHITE, 0.4)};
  }

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  ${media.desktop} {
    width: 40px;
    height: 40px;
    top: 38%;
    ${({ $direction }) =>
      $direction === "left" ? "left: 16px;" : "right: 16px;"}

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const DotsContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;

  ${media.desktop} {
    bottom: 20px;
  }
`;

export const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "24px" : "8px")};
  height: 8px;
  border-radius: 4px;
  border: none;
  background: ${({ $active, theme }) =>
    $active
      ? theme.colors.primary.WHITE
      : alpha(theme.colors.primary.WHITE, 0.4)};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  padding: 0;
  outline: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.WHITE};
    ${({ $active }) => !$active && "opacity: 0.8;"}
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px
      ${({ theme }) => alpha(theme.colors.primary.WHITE, 0.4)};
  }
`;
