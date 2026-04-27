import styled, { css } from "styled-components";
import { MonoText } from "../Monotext";
import { media } from "@repo/ui/breakpoints";
import { typography } from "@repo/ui/typography";
import { INPUT_VARIANTS, InputVariant } from "@/utils/Constants";

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
  $variant?: InputVariant;
}>`
  padding: 11px 10px 11px 16px;
  ${({ $hasIcon }) =>
    $hasIcon &&
    css`
      padding-right: 46px;
    `}
  ${({ theme }) => theme.typography.Body_Regular};
  height: ${({ $height }) => $height || "40px"};
  background: ${({ $hasError, $locked, $variant, theme }) =>
    $hasError
      ? `color-mix(in srgb, ${theme.colors.primary.RED} 8%, transparent)`
      : $locked
        ? theme.colors.neutral.GRAY_200
        : $variant === INPUT_VARIANTS.PRIMARY_GRAY
          ? theme.colors.primary.GRAY
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

export const Field = styled.div`
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_300};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  min-height: 44px;
`;

export const Selected = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 100%;
  z-index: 1200;
`;

export const Item = styled.button`
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  padding: 12px 14px;
  cursor: pointer;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  }
`;

export const DateDisplay = styled.div`
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  border: 1px solid transparent;
  cursor: pointer;
`;

export const DateText = styled.div`
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const DatePopup = styled.div`
  position: fixed;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  padding: 20px;
  max-width: 92vw;
  width: 720px;
  z-index: 1400;
  max-height: calc(100vh - 160px);
  overflow: auto;
`;

export const DatePopupBody = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
`;

export const DatePopupActions = styled.div`
  gap: 12px;
`;

/* Calendar styles */
export const CalendarWrapper = styled.div`
  display: flex;
  gap: 18px;
`;

export const CalendarMonth = styled.div`
  background: transparent;
  min-width: 280px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const MonthTitle = styled.div`
  ${({ theme }) => theme.typography.Body_SemiBold};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

export const DayButton = styled.button<{ $isOutside?: boolean }>`
  width: 100%;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: none;
  background: ${({ $isOutside, theme }) =>
    $isOutside ? "transparent" : theme.colors.neutral.GRAY_100};
  cursor: pointer;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const DaySelected = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const DayInRange = styled.div`
  min-width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.Body_Regular};
`;
export const CalendarNavButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  background: ${({ theme }) => theme.colors.primary.WHITE};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ArrowWrap = styled.span`
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
`;
