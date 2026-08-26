"use client";

import {
  Building2,
  CreditCard,
  Hash,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Modal } from "../../common/Modal";
import { MODAL_SIZE } from "../../../utils/constants";
import type { CreatorWalletItem } from "../../../types/payout-request";
import {
  AccountDetailsAvatar,
  AccountDetailsBody,
  AccountDetailsEmpty,
  AccountDetailsEmptyIcon,
  AccountDetailsEmptyText,
  AccountDetailsEmptyTitle,
  AccountDetailsField,
  AccountDetailsFieldLabel,
  AccountDetailsFieldValue,
  AccountDetailsGrid,
  AccountDetailsHeaderCard,
  AccountDetailsHeaderEmail,
  AccountDetailsHeaderMeta,
  AccountDetailsHeaderName,
  AccountDetailsSection,
  AccountDetailsSectionTitle,
} from "./PayoutDashboard.styles";

type AccountDetailsModalProps = {
  creator: CreatorWalletItem | null;
  open: boolean;
  onClose: () => void;
};

function displayValue(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function getInitials(fullName: string | null, email: string) {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  if (parts[0]) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase() || "CR";
}

export function AccountDetailsModal({
  creator,
  open,
  onClose,
}: AccountDetailsModalProps) {
  if (!open || !creator) {
    return null;
  }

  const details = creator.accountDetails;
  const displayName = creator.fullName?.trim() || creator.email;
  const bankName =
    details?.bankName === "Default Bank" ? "" : details?.bankName;

  const fields = [
    {
      key: "holder",
      label: "Account holder",
      value: displayValue(details?.accountHolderName),
      icon: <UserRound size={14} />,
    },
    {
      key: "bank",
      label: "Bank name",
      value: displayValue(bankName),
      icon: <Building2 size={14} />,
    },
    {
      key: "reg",
      label: "Reg. no.",
      value: displayValue(details?.registrationNumber),
      icon: <Hash size={14} />,
    },
    {
      key: "account",
      label: "Account no.",
      value: displayValue(details?.accountNumber),
      icon: <CreditCard size={14} />,
    },
  ];

  const hasAnyDetail = Boolean(
    details &&
    (details.accountHolderName?.trim() ||
      bankName?.trim() ||
      details.registrationNumber?.trim() ||
      details.accountNumber?.trim()),
  );

  return (
    <Modal
      title="Account details"
      open={open}
      onClose={onClose}
      size={MODAL_SIZE.MD}
    >
      <AccountDetailsBody>
        <AccountDetailsHeaderCard>
          <AccountDetailsAvatar aria-hidden>
            {getInitials(creator.fullName, creator.email)}
          </AccountDetailsAvatar>
          <AccountDetailsHeaderMeta>
            <AccountDetailsHeaderName>{displayName}</AccountDetailsHeaderName>
            <AccountDetailsHeaderEmail>
              {creator.email}
            </AccountDetailsHeaderEmail>
          </AccountDetailsHeaderMeta>
        </AccountDetailsHeaderCard>

        {hasAnyDetail ? (
          <AccountDetailsSection>
            <AccountDetailsSectionTitle>
              <WalletCards size={14} />
              Payment information
            </AccountDetailsSectionTitle>
            <AccountDetailsGrid>
              {fields.map((field) => (
                <AccountDetailsField key={field.key}>
                  <AccountDetailsFieldLabel>
                    {field.icon}
                    {field.label}
                  </AccountDetailsFieldLabel>
                  <AccountDetailsFieldValue>
                    {field.value}
                  </AccountDetailsFieldValue>
                </AccountDetailsField>
              ))}
            </AccountDetailsGrid>
          </AccountDetailsSection>
        ) : (
          <AccountDetailsEmpty>
            <AccountDetailsEmptyIcon>
              <WalletCards size={22} />
            </AccountDetailsEmptyIcon>
            <AccountDetailsEmptyTitle>
              No payment information yet
            </AccountDetailsEmptyTitle>
            <AccountDetailsEmptyText>
              This creator has not added bank details on their profile. Ask them
              to complete payment information to continue payouts.
            </AccountDetailsEmptyText>
          </AccountDetailsEmpty>
        )}
      </AccountDetailsBody>
    </Modal>
  );
}
