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

export const InlineSecondaryButton = styled(InlineActionButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.GREEN};
  border-color: ${({ theme }) => theme.colors.primary.GREEN};
  box-shadow: none;

  &:hover:not(:disabled) {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.GREEN} 8%,
      ${({ theme }) => theme.colors.neutral.WHITE}
    );
    color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    border-color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
  }
`;

export const AccountDetailsBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const AccountDetailsHeaderCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3.5)};
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: linear-gradient(
    135deg,
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.GREEN} 8%,
      ${({ theme }) => theme.colors.neutral.WHITE}
    ),
    ${({ theme }) => theme.colors.neutral.GRAY_100}
  );
`;

export const AccountDetailsAvatar = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

export const AccountDetailsHeaderMeta = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AccountDetailsHeaderName = styled.div`
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AccountDetailsHeaderEmail = styled.div`
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AccountDetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2.5)};
`;

export const AccountDetailsSectionTitle = styled.h4`
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

export const AccountDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(2.5)};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const AccountDetailsField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  min-width: 0;
`;

export const AccountDetailsFieldLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

export const AccountDetailsFieldValue = styled.span`
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 15px;
  font-weight: 650;
  line-height: 1.35;
  word-break: break-word;
`;

export const AccountDetailsEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(6)} ${theme.spacing(4)}`};
  border-radius: 14px;
  border: 1px dashed ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const AccountDetailsEmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.primary.GREEN} 12%,
    ${({ theme }) => theme.colors.neutral.WHITE}
  );
  color: ${({ theme }) => theme.colors.primary.GREEN};
`;

export const AccountDetailsEmptyTitle = styled.div`
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 15px;
  font-weight: 700;
`;

export const AccountDetailsEmptyText = styled.p`
  margin: 0;
  max-width: 320px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
`;
