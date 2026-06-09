import styled from "styled-components";
import { SORT_DROPDOWN_VARIANT, SortDropdownVariant } from "@/utils/Constants";

export const SortBox = styled.div<{
  $width?: string;
  $maxWidth?: string;
  $variant?: SortDropdownVariant;
  $compact?: boolean;
}>`
  position: relative;
  width: ${({ $width, $compact }) => $width || ($compact ? "auto" : "100%")};
  max-width: ${({ $maxWidth, $compact }) =>
    $maxWidth || ($compact ? "none" : "200px")};
  min-height: ${({ $compact }) => ($compact ? "auto" : "44px")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $variant, $compact }) =>
    $compact
      ? "4px 2px"
      : $variant === SORT_DROPDOWN_VARIANT.SURFACE
        ? "10px 16px"
        : $variant === SORT_DROPDOWN_VARIANT.SUCCESS
          ? "11px 16px"
          : "13px 15px"};
  gap: ${({ $compact }) => ($compact ? "0" : "8px")};
  background: ${({ theme, $variant, $compact }) =>
    $compact
      ? "transparent"
      : $variant === SORT_DROPDOWN_VARIANT.SURFACE
        ? theme.colors.primary.WHITE
        : $variant === SORT_DROPDOWN_VARIANT.SUCCESS
          ? theme.colors.primary.GREEN_50
          : theme.colors.neutral.OFF_WHITE};
  border-radius: ${({ $variant, theme, $compact }) =>
    $compact
      ? "0"
      : $variant === SORT_DROPDOWN_VARIANT.SURFACE
        ? "8px"
        : $variant === SORT_DROPDOWN_VARIANT.SUCCESS
          ? theme.radius.lg
          : "12px"};
  border: ${({ $compact, $variant, theme }) =>
    $compact
      ? "0"
      : `1px solid ${
          $variant === SORT_DROPDOWN_VARIANT.SURFACE
            ? theme.colors.neutral.GRAY_200
            : $variant === SORT_DROPDOWN_VARIANT.SUCCESS
              ? theme.colors.primary.GREEN_50
              : theme.colors.primary.GRAY
        }`};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
`;

export const Dropdown = styled.div<{
  $maxWidth?: string;
  $variant?: SortDropdownVariant;
  $width?: string;
}>`
  position: absolute;
  top: 120%;
  right: 0;
  width: ${({ $width }) => $width || "100%"};
  max-width: ${({ $maxWidth }) => $maxWidth || "200px"};
  padding: ${({ $variant }) =>
    $variant === SORT_DROPDOWN_VARIANT.SURFACE ? "8px" : "12px"};
  background: ${({ theme, $variant }) =>
    $variant === SORT_DROPDOWN_VARIANT.SURFACE
      ? theme.colors.primary.WHITE
      : $variant === SORT_DROPDOWN_VARIANT.SUCCESS
        ? theme.colors.primary.WHITE
        : theme.colors.neutral.OFF_WHITE};
  border-radius: ${({ $variant, theme }) =>
    $variant === SORT_DROPDOWN_VARIANT.SURFACE
      ? "8px"
      : $variant === SORT_DROPDOWN_VARIANT.SUCCESS
        ? theme.radius.lg
        : "12px"};
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const DropdownItem = styled.div<{
  $variant?: SortDropdownVariant;
  $active?: boolean;
}>`
  padding: ${({ $variant }) =>
    $variant === SORT_DROPDOWN_VARIANT.SURFACE
      ? "10px 12px"
      : $variant === SORT_DROPDOWN_VARIANT.SUCCESS
        ? "12px 14px"
        : "12px 14px"};
  border-radius: ${({ $variant, theme }) =>
    $variant === SORT_DROPDOWN_VARIANT.SURFACE
      ? "8px"
      : $variant === SORT_DROPDOWN_VARIANT.SUCCESS
        ? theme.radius.md
        : "12px"};
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme, $variant, $active }) =>
    $variant === SORT_DROPDOWN_VARIANT.SUCCESS && $active
      ? theme.colors.neutral.OFF_WHITE
      : "transparent"};

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === SORT_DROPDOWN_VARIANT.SUCCESS
        ? theme.colors.neutral.GRAY_100
        : theme.colors.neutral.GRAY_100};
  }
`;

export const Text = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`;
