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
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  ${media.mobileLg} {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
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
