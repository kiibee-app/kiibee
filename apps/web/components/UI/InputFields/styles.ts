import styled, { css } from "styled-components";
import { media } from "@repo/ui/breakpoints";

const labelFontStyles = {
  Body_Title6: css`
    font-size: 0.875rem;
    line-height: 1.4;
    font-weight: 600;
  `,
  Body_Title7: css`
    font-size: 0.8125rem;
    line-height: 1.4;
    font-weight: 600;
  `,
} as const;

const inputFontStyles = css`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 0.875rem;
  line-height: 1.4;
  font-weight: 400;
`;

export type LabelFontStyle = keyof typeof labelFontStyles;

export const Container = styled.div<{ width?: string | undefined }>`
  display: flex;
  flex-direction: column;
  width: ${({ width }) => width || "100%"};
  border: none;
  padding: 0;
  margin: 0;
`;

export const Label = styled.label<{
  $labelFontStyle?: LabelFontStyle;
  $paddingLeft?: string;
  $marginTop?: string;
}>`
  margin-bottom: 8px;
  padding-left: ${({ $paddingLeft }) => $paddingLeft || "0"};
  margin-top: ${({ $marginTop }) => $marginTop || "12px"};
  text-align: left;
  display: block;
  float: left;
  width: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ $labelFontStyle }) => labelFontStyles[$labelFontStyle || "Body_Title6"]};

  ${media.mobile} {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    font-size: 14px;
  }
`;

export const InputWrapper = styled.div<{ $multi?: boolean }>`
  position: relative;
  width: 100%;
  display: ${(props) => (props.$multi ? "flex" : "block")};
  gap: ${(props) => (props.$multi ? "8px" : "0")};
`;

export const StyledInput = styled.input<{
  $hasError?: boolean;
  $locked?: boolean;
  $height?: string;
  $hasIcon?: boolean;
}>`
  padding: 11px 10px 11px 16px;
  ${({ $hasIcon }) =>
    $hasIcon &&
    css`
      padding-right: 46px;
    `}
  ${inputFontStyles};
  height: ${({ $height }) => $height || "40px"};
  background: ${({ $hasError, $locked, theme }) =>
    $hasError
      ? `color-mix(in srgb, ${theme.colors.primary.RED} 8%, transparent)`
      : $locked
        ? theme.colors.neutral.GRAY_200
        : theme.colors.neutral.GRAY_100};
  border: 1px solid
    ${({ $hasError, theme }) =>
      $hasError ? theme.colors.primary.RED : "transparent"};
  border-radius: ${({ theme }) => theme.radius.lg};
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    background-color 150ms ease;
  opacity: ${({ $locked }) => ($locked ? 0.8 : 1)};
  cursor: ${({ $locked }) => ($locked ? "not-allowed" : "text")};

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
    ${inputFontStyles};
  }

  &:focus {
    border-color: ${({ $hasError, $locked, theme }) =>
      $hasError
        ? theme.colors.primary.RED
        : $locked
          ? theme.colors.neutral.GRAY_400
          : theme.colors.primary.BLACK};
  }

  ${media.mobile} {
    &:focus-visible {
      outline: 2px solid
        ${({ $hasError, $locked, theme }) =>
          $hasError
            ? theme.colors.primary.RED
            : $locked
              ? theme.colors.neutral.GRAY_400
              : theme.colors.primary.BLACK};
      outline-offset: 2px;
    }
  }

  ${media.mobile} {
    font-size: 16px;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }

  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const StyledTextArea = styled.textarea<{
  $hasError?: boolean;
  $locked?: boolean;
}>`
  width: 100%;
  min-height: 110px;
  padding: 10px 12px;
  border: 1px solid
    ${({ $hasError, theme }) =>
      $hasError ? theme.colors.primary.RED : "transparent"};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ $locked, theme }) =>
    $locked ? theme.colors.neutral.GRAY_200 : theme.colors.neutral.GRAY_100};
  resize: vertical;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${inputFontStyles};
  line-height: 1.5;
  outline: none;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    background-color 150ms ease;

  &:focus {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.primary.RED : theme.colors.primary.BLACK};
  }

  ${media.mobile} {
    &:focus-visible {
      outline: 2px solid
        ${({ $hasError, theme }) =>
          $hasError ? theme.colors.primary.RED : theme.colors.primary.BLACK};
      outline-offset: 2px;
    }
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
    ${inputFontStyles};
  }

  ${media.mobile} {
    padding: ${({ theme }) => theme.spacing[4]};
    font-size: 16px;
  }
`;

export const ErrorText = styled.span`
  margin-top: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 0.75rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.primary.RED};
`;

export const RequiredIndicator = styled.span`
  color: ${({ theme }) => theme.colors.primary.RED};
  margin-left: 4px;
`;
