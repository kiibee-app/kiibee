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

export const PayoutFormInput = styled.input`
  height: ${({ theme }) => theme.spacing(10.5)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  padding: 0 ${({ theme }) => theme.spacing(3)};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.GREEN};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    border-color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${media.mobileLg} {
    width: 100%;
  }
`;
