import styled, { css } from "styled-components";
import { VARIANT, type Variant } from "@/utils/Constants";

export type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleProps = {
  $variant: Variant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $minWidth?: string;
};

const sizeStyles = {
  sm: css`
    min-height: 23px;
    padding: 6px 14px;
    ${({ theme }) => theme.typography.Body_Bold}
  `,
  md: css`
    min-height: 40px;
    padding: 7px 18px;
    ${({ theme }) => theme.typography.Body_Medium}
  `,
  lg: css`
    min-height: 49px;
    padding: 14px 24px;
    ${({ theme }) => theme.typography.Body_Medium}
  `,
};

export const shared = css<ButtonStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  min-width: ${({ $minWidth }) => $minWidth ?? "0"};
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 120ms ease;
  ${({ $size }) => sizeStyles[$size]}

  &:disabled,
  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.55;
    pointer-events: none;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case VARIANT.PRIMARY:
        return css`
          background: ${({ theme }) => theme.colors.primary.BLACK};
          color: ${({ theme }) => theme.colors.primary.WHITE};
          border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
          &:hover {
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
          &:hover {
            background: transparent;
            border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
            opacity: 1;
          }
        `;

      default:
        return css`
          background: transparent;
          color: ${({ theme }) => theme.colors.primary.BLACK};
          border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
          &:hover {
            background: ${({ theme }) => theme.colors.primary.BLACK};
            color: ${({ theme }) => theme.colors.primary.WHITE};
            border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
            transform: translateY(-1px);
            opacity: 0.98;
          }
        `;
    }
  }}
`;

export const ButtonEl = styled.button<ButtonStyleProps>`
  ${shared}
`;

export const AnchorEl = styled.a<ButtonStyleProps>`
  ${shared}
`;
