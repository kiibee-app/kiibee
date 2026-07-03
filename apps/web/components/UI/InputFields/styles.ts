import styled, { css } from "styled-components";
import COLORS from "@repo/ui/colors";
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
        : $variant === INPUT_VARIANTS.SURFACE
          ? theme.colors.primary.WHITE
          : $variant === INPUT_VARIANTS.PRIMARY_GRAY
            ? theme.colors.primary.GRAY
            : theme.colors.neutral.GRAY_100};
  border: 1px solid
    ${({ $hasError, $variant, theme }) =>
      $hasError
        ? theme.colors.primary.RED
        : $variant === INPUT_VARIANTS.SURFACE
          ? theme.colors.neutral.GRAY_200
          : "transparent"};
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
  $variant?: InputVariant;
}>`
  width: 100%;
  min-height: 110px;
  padding: 10px 12px;
  border: 1px solid
    ${({ $hasError, theme }) =>
      $hasError ? theme.colors.primary.RED : "transparent"};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ $hasError, $locked, $variant, theme }) =>
    $hasError
      ? `color-mix(in srgb, ${theme.colors.primary.RED} 8%, transparent)`
      : $locked
        ? theme.colors.neutral.GRAY_200
        : $variant === INPUT_VARIANTS.SURFACE
          ? theme.colors.primary.WHITE
          : $variant === INPUT_VARIANTS.PRIMARY_GRAY
            ? theme.colors.primary.GRAY
            : theme.colors.neutral.GRAY_100};
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
  position: relative;
  top: 1px;
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

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 2px;
    border-radius: 2px;
  }
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
  box-shadow: 0 8px 20px ${({ theme }) => theme.colors.neutral.GRAY_300};
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 240px;
  overscroll-behavior: contain;
  touch-action: pan-y;
  width: 100%;
  z-index: 1200;
  ${media.tablet} {
    max-height: 150px;
  }
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: -2px;
    border-radius: 2px;
  }

  touch-action: pan-y;
`;

export const ItemContent = styled.span`
  flex: 1;
`;

export const ItemCheckIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const DateDisplay = styled.div`
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 44px;
  border: 1px solid transparent;
  cursor: pointer;
`;

export const BorderedDateDisplay = styled(DateDisplay)`
  border: 1px solid ${COLORS.neutral.GRAY_200};
`;

export const DateText = styled.div<{ $isPlaceholder?: boolean }>`
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ $isPlaceholder, theme }) =>
    $isPlaceholder
      ? theme.colors.neutral.GRAY_400
      : theme.colors.primary.BLACK};
  flex: 1;
  min-width: 0;
`;

export const DateFieldActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const DateCalendarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
`;

export const DatePopup = styled.div<{
  $top: number;
  $left: number;
}>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 12px;
  box-shadow: 0 12px 30px ${({ theme }) => theme.colors.neutral.GRAY_300};
  max-width: 92vw;
  z-index: 1400;
  overflow: hidden;

  ${media.mobileMd} {
    position: fixed;
    top: auto;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 16px);
    max-width: calc(100% - 16px);
  }
`;

export const DatePopupScroll = styled.div`
  max-height: calc(100vh - 160px);
  overflow: auto;
  padding: 20px;

  ${media.mobileMd} {
    max-height: calc(100vh - 160px - 2px);
  }
`;

export const DatePopupBody = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const DatePopupActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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

export const CancelButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  background: transparent;
  cursor: pointer;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.BLACK};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  }
`;

export const DatePopupWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1400;

  ${media.mobileMd} {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
`;

export const TagsInputWrapper = styled.div<{
  $hasError?: boolean;
  $variant?: InputVariant;
}>`
  padding: 8px 12px;
  background: ${({ $hasError, $variant, theme }) =>
    $hasError
      ? `color-mix(in srgb, ${theme.colors.primary.RED} 8%, transparent)`
      : $variant === INPUT_VARIANTS.PRIMARY_GRAY
        ? theme.colors.primary.GRAY
        : theme.colors.neutral.GRAY_100};
  border: 1px solid
    ${({ $hasError, theme }) =>
      $hasError ? theme.colors.primary.RED : theme.colors.neutral.GRAY_200};
  border-radius: ${({ theme }) => theme.radius.lg};
  min-height: 40px;
  cursor: text;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    background-color 150ms ease;

  &:focus-within {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.primary.RED : theme.colors.primary.BLACK};
  }
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_250};
  border-radius: 16px;
  ${({ theme }) => theme.typography.Body_Medium};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const TagText = styled.span`
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TagRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: inherit;

  &:hover {
    opacity: 0.7;
  }
`;

export const TagsInputField = styled.input`
  flex: 1;
  min-width: 120px;
  border: none;
  background: transparent;
  outline: none;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  padding: 4px 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }
`;

export const DatePopupScrollCustom = styled(DatePopupScroll)`
  padding: 16px;
`;

export const DatePopupBodyCustom = styled(DatePopupBody)`
  padding-bottom: 0;
  border-bottom: none;
`;

export const DatePopupActionsCustom = styled(DatePopupActions)`
  margin-top: 12px;
`;
