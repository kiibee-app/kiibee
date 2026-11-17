import styled from "styled-components";
import { ModalConfirmButton } from "./Creators.styles";
import { TextInput } from "./CreatorAppearanceSettings.styles";

export const PricingDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 13px;
  line-height: 1.65;
  overflow-wrap: anywhere;
`;
export const PricingFields = styled.div`
  display: grid;
  gap: 18px;
  margin: 22px 0;
`;
export const PricingField = styled.label`
  display: grid;
  gap: 8px;
  min-width: 0;
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 13px;
  font-weight: 600;
`;
export const PricingInput = styled(TextInput)`
  box-sizing: border-box;
  font-family: inherit;
  font-weight: 400;
  appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &:disabled {
    opacity: 0.65;
  }
`;
export const PricingHint = styled.p`
  margin: 0 0 18px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 12px;
  line-height: 1.5;
`;
export const PricingConfirmButton = styled(ModalConfirmButton)`
  background: ${({ theme }) => theme.colors.primary.GREEN};
  border-color: ${({ theme }) => theme.colors.primary.GREEN};
`;
