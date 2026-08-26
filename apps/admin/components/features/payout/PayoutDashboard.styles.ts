import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { StatusBadge } from "../all-creators/AllCreators.styles";
import type { BadgeStatus } from "../../../types/payout-request";

export const PayoutToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const PayoutForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const PayoutFormField = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 13px;
  font-weight: 600;
`;

export const PayoutFormInput = styled.input<{ $invalid?: boolean }>`
  height: ${({ theme }) => theme.spacing(10.5)};
  border: 1px solid
    ${({ $invalid, theme }) =>
      $invalid ? theme.colors.primary.RED : theme.colors.secondary.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  padding: 0 ${({ theme }) => theme.spacing(3)};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ $invalid, theme }) =>
      $invalid ? theme.colors.primary.RED : theme.colors.primary.GREEN};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const PayoutFieldError = styled.span`
  color: ${({ theme }) => theme.colors.primary.RED};
  font-size: 12px;
  font-weight: 500;
`;

export const PayoutFormSelect = styled.select`
  height: ${({ theme }) => theme.spacing(10.5)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  padding: 0 ${({ theme }) => theme.spacing(3)};
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.GREEN};
  }
`;

export const PayoutFeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const PayoutFeeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 13px;
`;

export const PayoutFeeTotal = styled(PayoutFeeRow)`
  padding-top: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.secondary.border};
  color: ${({ theme }) => theme.colors.secondary.main};
  font-weight: 700;
`;

export const PayoutModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`;

export const PayoutButton = styled.button`
  min-height: ${({ theme }) => theme.spacing(10.5)};
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: ${({ theme }) => `0 ${theme.spacing(4)}`};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    background ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    border-color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PayoutSecondaryButton = styled(PayoutButton)`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  border-color: ${({ theme }) => theme.colors.secondary.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
    border-color: ${({ theme }) => theme.colors.secondary.border};
  }
`;

export const PayoutHint = styled.span`
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.typography.Body_Medium.fontWeight};
`;

export const PayoutStatusBadge = styled(StatusBadge)<{
  $status: BadgeStatus;
}>`
  ${({ $status, theme }) =>
    $status === "rejected"
      ? `
        background: ${theme.colors.primary.WHITE};
        color: ${theme.colors.primary.RED};
        border: 1px solid ${theme.colors.primary.RED};
      `
      : ""}
`;

export const InlineActionButton = styled.button`
  min-height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 0 ${({ theme }) => theme.spacing(3)};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    background ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    border-color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }

  ${media.mobileLg} {
    width: 100%;
  }
`;

export const InlineSecondaryButton = styled(InlineActionButton)`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.GREEN};
  border-color: ${({ theme }) => theme.colors.primary.GREEN};
  box-shadow: none;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
    color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    border-color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
  }
`;

export const InlineActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;

  ${media.mobileLg} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const MethodToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const MethodToggleButton = styled.button<{ $active?: boolean }>`
  min-height: 40px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary.GREEN : "transparent"};
  border-radius: 10px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.neutral.WHITE : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.secondary.main : theme.colors.secondary.muted};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadows.sm : "none")};
  transition:
    background ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.secondary.main};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PayoutFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(3)};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const PayoutFormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const PayoutFormSectionTitle = styled.span`
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 13px;
  font-weight: 700;
`;
