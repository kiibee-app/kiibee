import styled, { css } from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import { layoutAlignCss } from "@/components/Feature/ProfileLayout/Hero/styles";

export const GateWrapper = styled.div<{ $variant?: string }>`
  width: 100%;
  ${({ $variant, theme }) =>
    $variant === "content"
      ? css`
          padding: 0;
          background: transparent;
        `
      : css`
          padding: 40px 0 100px;
          background: ${theme.colors.neutral.WHITE};
          min-height: 400px;

          ${theme.media.desktopSm} {
            padding: 32px 0 80px;
          }

          ${theme.media.mobileLg} {
            padding: 24px 0 60px;
          }
        `}
`;

export const GateInner = styled.div<{ $variant?: string }>`
  ${({ $variant }) =>
    $variant === "content"
      ? css`
          width: 100%;
          margin: 0;
          padding: 0;
        `
      : layoutAlignCss}
`;

export const GateCard = styled.div<{ $variant?: string }>`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

export const GateTitle = styled.h2`
  margin: 0 0 24px;

  ${({ theme }) => theme.media.mobileLg} {
    margin-bottom: 20px;
  }
`;

export const GateTitleText = styled(MonoText).attrs(({ theme }) => ({
  $use: "H4_SemiBold",
  color: theme.colors.primary.BLACK,
}))``;

export const GateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;
`;

export const GateFieldsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const GateFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const GateLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
`;

export const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.primary.RED};
`;

export const GateInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  outline: none;
  box-sizing: border-box;
  transition:
    border-color ${({ theme }) => theme.animations.fast},
    background-color ${({ theme }) => theme.animations.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.neutral.GRAY_400};
    background: ${({ theme }) => theme.colors.neutral.WHITE};
  }
`;

export const GateSubmitButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: opacity ${({ theme }) => theme.animations.fast};
  margin-top: 4px;

  &:hover:not(:disabled) {
    opacity: 0.88;
  }

  &:active:not(:disabled) {
    opacity: 0.76;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY_300};
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
    cursor: not-allowed;
    opacity: 1;
  }
`;

export const GateConsentText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
`;
