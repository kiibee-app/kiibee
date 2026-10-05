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
          padding: 24px 0 40px;
          background: ${theme.colors.neutral.WHITE};
          min-height: 0;

          ${theme.media.desktopSm} {
            padding: 20px 0 32px;
          }

          ${theme.media.mobileLg} {
            padding: 16px 0 24px;
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
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  border: none;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  max-width: 352px;
  box-sizing: border-box;

  ${({ theme }) => theme.media.mobileLg} {
    padding: 12px;
  }
`;

export const GateTitle = styled.h2`
  margin: 0 0 12px;

  ${({ theme }) => theme.media.mobileLg} {
    margin-bottom: 10px;
  }
`;

export const GateTitleText = styled(MonoText).attrs(({ theme }) => ({
  $use: "H4_SemiBold",
  color: theme.colors.primary.BLACK,
}))`
  font-size: 16px;
  line-height: 1.3;
`;

export const GateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 100%;
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
  gap: 6px;
  width: 100%;
`;

export const GateLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
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
  height: 40px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  font-size: 13px;
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
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: opacity ${({ theme }) => theme.animations.fast};
  margin-top: 0;

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
