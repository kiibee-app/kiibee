import { Variant, VARIANT } from "@/utils/Constants";
import { css } from "styled-components";

export type ButtonSize = "sm" | "md" | "lg";

export const BUTTON_HEIGHTS: Record<ButtonSize, string> = {
  sm: "32px",
  md: "40px",
  lg: "48px",
};

type ButtonStyleProps = {
  $variant: Variant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $minWidth?: string;
};

export const sizeStyles = {
  sm: css`
    height: ${BUTTON_HEIGHTS.sm};
    padding: 0 12px;
    ${({ theme }) => theme.typography.Body_Bold}
  `,
  md: css`
    height: ${BUTTON_HEIGHTS.md};
    padding: 0 16px;
    ${({ theme }) => theme.typography.Body_Medium}
  `,
  lg: css`
    height: ${BUTTON_HEIGHTS.lg};
    padding: 0 24px;
    ${({ theme }) => theme.typography.Body_Medium}
  `,
};

export const shared = css<ButtonStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-sizing: border-box;
  white-space: nowrap;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  min-width: ${({ $minWidth }) => $minWidth ?? "0"};
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 120ms ease;
  ${({ $size }) => sizeStyles[$size]}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 2px;
  }

  &:disabled,
  &[aria-disabled="true"] {
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
    border-color: ${({ theme }) => theme.colors.neutral.GRAY_200};
    box-shadow: none;
    cursor: not-allowed;
    opacity: 1;
    pointer-events: none;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case VARIANT.PRIMARY:
        return css`
          background: ${({ theme }) => theme.colors.primary.BLACK};
          color: ${({ theme }) => theme.colors.primary.WHITE};
          border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
          box-shadow: ${({ theme }) => theme.shadows.lg};
          &:not([type="submit"]):hover {
            background: transparent;
            color: ${({ theme }) => theme.colors.primary.BLACK};
            box-shadow: none;
            transform: none;
            opacity: 1;
          }
        `;

      case VARIANT.PRIMARY_LITE:
        return css`
          background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
          color: ${({ theme }) => theme.colors.primary.BLACK};
          border: 1px solid transparent;
          border-radius: 0.5rem;
          &:not([type="submit"]):hover {
            background: transparent;
            border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
            opacity: 1;
          }
        `;

      case VARIANT.DANGER:
        return css`
          background: ${({ theme }) => theme.colors.primary.RED};
          color: ${({ theme }) => theme.colors.primary.WHITE};
          border: 1px solid ${({ theme }) => theme.colors.primary.RED};
          border-radius: 8px;

          &:not([type="submit"]):hover {
            background: ${({ theme }) => theme.colors.primary.WHITE};
            color: ${({ theme }) => theme.colors.primary.RED};
            border: 1px solid ${({ theme }) => theme.colors.primary.RED};
            opacity: 1;
          }
        `;

      case VARIANT.SOFT_OUTLINE:
        return css`
          background: ${({ theme }) => theme.colors.neutral.WHITE};
          color: ${({ theme }) => theme.colors.primary.BLACK};
          border: 1.3px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
          border-radius: 999px;

          &:not([type="submit"]):hover {
            background: ${({ theme }) => theme.colors.neutral.GRAY_100};
            border-color: ${({ theme }) => theme.colors.neutral.GRAY_300};
            opacity: 1;
          }
        `;

      default:
        return css`
          background: transparent;
          color: ${({ theme }) => theme.colors.primary.BLACK};
          border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
          &:not([type="submit"]):hover {
            background: ${({ theme }) => theme.colors.primary.BLACK};
            color: ${({ theme }) => theme.colors.primary.WHITE};
            border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
            box-shadow: ${({ theme }) => theme.shadows.lg};
            transform: translateY(-1px);
            opacity: 0.98;
          }
        `;
    }
  }}

  &:active {
    transform: scale(0.98) translateY(0);
    opacity: 0.8;
  }
`;

const buttonVariants = {};

export default buttonVariants;
