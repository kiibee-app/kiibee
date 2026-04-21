import styled, { css } from "styled-components";
import { MonoText } from "../Monotext";
import { media } from "@repo/ui/breakpoints";
import { typography } from "@repo/ui/typography";

export const Container = styled.div<{ width?: string | undefined }>`
  display: flex;
  flex-direction: column;
  width: ${({ width }) => width || "100%"};
  border: none;
  padding: 0;
  margin: 0;
`;

export const Label = styled(MonoText).attrs<{
  $use?: keyof typeof typography;
  $paddingLeft?: string | undefined;
  $marginTop?: string | undefined;
}>(({ $use }) => ({
  $use: $use || "Body_Medium",
}))<{
  $paddingLeft?: string;
  $marginTop?: string;
}>`
  margin-bottom: 8px;
  padding-left: ${({ $paddingLeft }) => $paddingLeft || "0"};
  margin-top: ${({ $marginTop }) => $marginTop || "12px"};
  text-align: left;
  display: block;
  width: 100%;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Regular};
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
  ${({ theme }) => theme.typography.Body_Regular};
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
    ${({ theme }) => theme.typography.Body_Regular};
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
  ${({ theme }) => theme.typography.Body_Regular};
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
    ${({ theme }) => theme.typography.Body_Regular};
  }

  ${media.mobile} {
    padding: ${({ theme }) => theme.spacing[4]};
    font-size: 16px;
  }
`;

export const ErrorText = styled.span`
  display: block;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.RED};
`;

export const HelperText = styled.span`
  display: block;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

export const FieldMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
`;

export const RequiredIndicator = styled.span`
  color: ${({ theme }) => theme.colors.primary.RED};
  margin-left: 4px;
`;
