import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import GenericButton from "@/components/UI/GenericButton";
import { SIZE, VARIANT } from "@/utils/Constants";

export const Screen = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  padding: 24px;

  ${media.mobileLg} {
    align-items: flex-start;
    padding: 32px 16px;
  }
`;

export const Card = styled.div`
  width: min(100%, 312px);
  min-height: 580px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  padding: 0 0 32px;

  ${media.mobileLg} {
    padding: 0 0 28px;
  }
`;

export const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  transform: translateY(-1px);

  img {
    display: block;
  }
`;

export const Title = styled.h1`
  margin: 0 0 20px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-align: center;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const PlanSelectWrap = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 42px;
`;

export const PlanSelect = styled.select`
  width: 100%;
  height: 38px;
  appearance: none;
  border: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary.PALE_GREEN};
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  padding: 0 42px 0 16px;
  outline: none;
  cursor: pointer;
  ${({ theme }) => theme.typography.Body_Medium};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 2px;
  }
`;

export const SelectIcon = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  display: inline-flex;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const PaymentMethods = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
`;

export const PaymentMethodButton = styled.button<{ $active?: boolean }>`
  position: relative;
  width: 78px;
  height: 50px;
  padding: 10px 5px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active
        ? theme.colors.secondary.MEDIUM_GREEN
        : theme.colors.neutral.GRAY_200};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  overflow: hidden;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 2px;
  }
`;

export const PaymentCardLogoWrap = styled.span`
  display: inline-flex;
  width: 68px;
  height: 30px;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
`;

export const PaymentMobileLogoWrap = styled.span`
  display: inline-flex;
  width: 68px;
  height: 30px;
  align-items: flex-end;
  justify-content: center;
`;

export const RadioDot = styled.span<{ $active?: boolean }>`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  padding: 2px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 1px solid
    ${({ $active, theme }) =>
      $active
        ? theme.colors.secondary.MEDIUM_GREEN
        : theme.colors.neutral.GRAY_400};
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};

  &::after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    top: 1px;
    left: 1px;
    border-radius: 50%;
    background: ${({ $active, theme }) =>
      $active ? theme.colors.secondary.MEDIUM_GREEN : "transparent"};
  }
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const InlineFields = styled.div`
  display: grid;
  grid-template-columns: 97px 97px;
  gap: 20px;
`;

export const SubmitButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.MD,
  fullWidth: true,
})`
  height: 38px;
  margin-top: 36px;
  border: 0;
  border-radius: 10px;
  box-shadow: none;

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY};
    border-color: ${({ theme }) => theme.colors.neutral.GRAY};
    opacity: 1;
  }
`;
