import styled from "styled-components";
import { PanelBody } from "./CreatorAppearanceSettings.styles";

export const BasePlanBody = styled(PanelBody)`
  display: grid;
  grid-template-columns: minmax(0, 640px) minmax(0, 1fr);
  align-items: start;
  gap: 20px 32px;

  > label {
    margin: 0;
  }

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const ManualPaymentSection = styled.div`
  display: grid;
  gap: 16px;
  justify-self: end;
  padding-top: 21px;
  max-width: 340px;

  @media (max-width: 1000px) {
    justify-self: start;
    padding-top: 0;
  }
`;

export const ManualPaymentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

export const ManualPaymentButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: fit-content;
  min-height: 34px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.neutral.DUSTY_TEAL : theme.colors.primary.GREEN};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.neutral.DUSTY_TEAL : theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 150ms ease,
    border-color 150ms ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary.GREEN};
    background: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.GREEN};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ManualPaymentExpiry = styled.div`
  width: 100%;
  max-width: 340px;
`;
