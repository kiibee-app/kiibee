import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const SlideLayout = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 1rem;
`;

export const ImageStack = styled.div`
  width: min(420px, 90%);
  height: 320px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SlideImage = styled.div<{
  $height?: string;
  $z?: number;
  $translateX?: string;
  $translateY?: string;
  $scale?: number;
  $isActive?: boolean;
}>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: ${({ $height }) => $height || "280px"};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  box-shadow: 0 35px 60px
    rgba(0, 0, 0, ${({ $isActive }) => ($isActive ? 0.35 : 0.25)});
  transform: translate(
      ${({ $translateX }) => $translateX || "0"},
      ${({ $translateY }) => $translateY || "0"}
    )
    scale(${({ $scale }) => $scale || 1});
  transition:
    transform 280ms ease,
    opacity 280ms ease;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.6)};
  z-index: ${({ $z }) => $z ?? 1};
`;

export const SlideContent = styled.div`
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const SlideTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary.WHITE};

  ${MonoText} {
    color: inherit;
  }
`;

export const SlideDots = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`;

export const Dot = styled.span<{ $active?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary.WHITE : theme.colors.neutral.GRAY_700};
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  transition: transform 200ms ease;

  ${({ $active }) =>
    $active &&
    `
      transform: scale(1.1);
    `}
`;
