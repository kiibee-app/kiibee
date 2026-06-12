import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const GateWrapper = styled.div<{ $variant?: string }>`
  width: 100%;
  ${({ $variant, theme }) =>
    $variant === "content"
      ? `
        padding: 0;
        background: transparent;
      `
      : `
        padding: 32px 73px;
        background: ${theme.colors.neutral.WHITE};

        ${theme.media.desktopSm} {
          padding: 28px 28px;
        }

        ${theme.media.mobileLg} {
          padding: 24px 16px;
        }
      `}
`;

export const GateInner = styled.div<{ $variant?: string }>`
  width: ${({ $variant }) =>
    $variant === "content" ? "100%" : "min(100%, 1380px)"};
  margin: 0 auto;
  padding: ${({ $variant }) => ($variant === "content" ? "0" : "0 6px")};
`;

export const GateCard = styled.div<{ $variant?: string }>`
  background: ${({ $variant, theme }) =>
    $variant === "content"
      ? theme.colors.neutral.PALE_GREEN
      : theme.colors.neutral.GRAY_100};
  border: ${({ $variant, theme }) =>
    $variant === "content"
      ? `1px solid ${theme.colors.neutral.DUSTY_TEAL}`
      : "none"};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ $variant }) => ($variant === "content" ? "24px" : "28px 32px")};
  max-width: ${({ $variant }) => ($variant === "content" ? "100%" : "480px")};

  ${({ theme }) => theme.media.mobileLg} {
    padding: 24px 20px;
    max-width: 100%;
  }
`;

export const GateTitle = styled.h2`
  margin: 0 0 24px;

  ${({ theme }) => theme.media.mobileLg} {
    margin-bottom: 20px;
  }
`;

export const GateTitleText = styled(MonoText).attrs(({ theme }) => ({
  $use: "H4_Medium",
  color: theme.colors.primary.BLACK,
}))``;

export const GateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const GateFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GateLabel = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_Medium",
  color: theme.colors.neutral.GRAY_500,
}))`
  display: block;
  margin-bottom: 4px;
`;

export const GateInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  outline: none;
  transition: border-color ${({ theme }) => theme.animations.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.neutral.GRAY_500};
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
  transition: opacity ${({ theme }) => theme.animations.fast};
  margin-top: 4px;

  &:hover {
    opacity: 0.88;
  }

  &:active {
    opacity: 0.76;
  }
`;

export const GateConsentText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_Small",
  color: theme.colors.neutral.GRAY_500,
}))`
  display: block;
  margin-top: 4px;
`;
