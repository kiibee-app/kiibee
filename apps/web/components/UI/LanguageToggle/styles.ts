import { media } from "@repo/ui/breakpoints";
import styled, { css } from "styled-components";
import { DA, EN } from "@/utils/common";

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0;
  height: 34px;
  padding: 3px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  box-shadow: inset ${({ theme }) => theme.shadows.sm};

  ${media.tablet} {
    height: 30px;
    padding: 2px;
  }
`;

export const Slider = styled.span<{ $active: typeof DA | typeof EN }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(50% - 3px);
  height: calc(100% - 6px);
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  transform: translateX(${({ $active }) => ($active === EN ? "100%" : "0")});

  ${media.tablet} {
    top: 2px;
    left: 2px;
    width: calc(50% - 2px);
    height: calc(100% - 4px);
  }
`;

const langBtn = css`
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 38px;
  height: 100%;
  padding: 0 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 999px;
  transition: color 0.2s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.GREEN};
    outline-offset: 2px;
  }

  ${media.tablet} {
    width: 34px;
    font-size: 11px;
    padding: 0 6px;
  }
`;

export const LangButton = styled.button<{ $active: boolean }>`
  ${langBtn}
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_400};
  background-color: transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.BLACK};
  }
`;
