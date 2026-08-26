"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Modal } from "../../common/Modal";
import { MODAL_SIZE } from "../../../utils/constants";
import { useUpsertAdminAccountDetails } from "../../../hooks/api";
import type { CreatorWalletItem } from "../../../types/payout-request";
import {
  formatAdminCardExpiry,
  formatAdminCardNumber,
  validateAccountDetailsForm,
  type AccountDetailsMethodType,
} from "../../../utils/payout";
import {
  MethodToggle,
  MethodToggleButton,
  PayoutButton,
  PayoutFieldError,
  PayoutForm,
  PayoutFormField,
  PayoutFormGrid,
  PayoutFormInput,
  PayoutFormSection,
  PayoutFormSectionTitle,
  PayoutHint,
  PayoutModalActions,
  PayoutSecondaryButton,
} from "./PayoutDashboard.styles";

type AccountDetailsModalProps = {
  creator: CreatorWalletItem | null;
  open: boolean;
  onClose: () => void;
};

function AccountDetailsForm({
  creator,
  onClose,
}: {
  creator: CreatorWalletItem;
  onClose: () => void;
}) {
  const existing = creator.accountDetails;
  const [methodType, setMethodType] = useState<AccountDetailsMethodType>(
    existing?.methodType ?? "bank",
  );
  const [accountNumber, setAccountNumber] = useState(
    existing?.accountNumber ?? "",
  );
  const [accountHolderName, setAccountHolderName] = useState(
    existing?.accountHolderName ?? "",
  );
  const [bankName, setBankName] = useState(existing?.bankName ?? "");
  const [cardNumber, setCardNumber] = useState(
    existing?.cardNumber ? formatAdminCardNumber(existing.cardNumber) : "",
  );
  const [cardExpiry, setCardExpiry] = useState(existing?.cardExpiry ?? "");
  const [showErrors, setShowErrors] = useState(false);
  const { mutate: saveDetails, isPending } = useUpsertAdminAccountDetails();

  const values = {
    methodType,
    accountNumber,
    accountHolderName,
    bankName,
    cardNumber,
    cardExpiry,
  };

  const currentErrors = validateAccountDetailsForm(values);
  const visibleErrors = showErrors ? currentErrors : {};

  const handleMethodChange = (nextType: AccountDetailsMethodType) => {
    setMethodType(nextType);
    setShowErrors(false);
  };

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateAccountDetailsForm(values);
    setShowErrors(true);

    if (Object.keys(nextErrors).length > 0 || isPending) return;

    saveDetails(
      {
        creatorId: creator.creatorId,
        methodType,
        accountHolderName: accountHolderName.trim(),
        ...(methodType === "bank"
          ? {
              accountNumber: accountNumber.replace(/\s/g, "").trim(),
              bankName: bankName.trim(),
            }
          : {
              cardNumber: cardNumber.replace(/\D/g, ""),
              cardExpiry: cardExpiry.trim(),
            }),
      },
      {
        onSuccess: () => {
          toast.success(
            methodType === "bank"
              ? "Bank account details saved."
              : "Card details saved.",
          );
          onClose();
        },
        onError: ({ message }) => {
          toast.error(message || "Failed to save details.");
        },
      },
    );
  };

  return (
    <Modal
      title={`${existing ? "Edit" : "Add"} payment details · ${creator.fullName || "Creator"}`}
      open
      onClose={handleClose}
      size={MODAL_SIZE.MD}
    >
      <PayoutForm onSubmit={handleSubmit} noValidate>
        <PayoutHint>
          Save bank or card details for admin payout reference. Separate from
          creator web settings.
        </PayoutHint>

        <MethodToggle role="tablist" aria-label="Payment detail type">
          <MethodToggleButton
            type="button"
            role="tab"
            $active={methodType === "bank"}
            aria-selected={methodType === "bank"}
            disabled={isPending}
            onClick={() => handleMethodChange("bank")}
          >
            Bank account
          </MethodToggleButton>
          <MethodToggleButton
            type="button"
            role="tab"
            $active={methodType === "card"}
            aria-selected={methodType === "card"}
            disabled={isPending}
            onClick={() => handleMethodChange("card")}
          >
            Card
          </MethodToggleButton>
        </MethodToggle>

        <PayoutFormSection>
          <PayoutFormSectionTitle>
            {methodType === "bank" ? "Bank details" : "Card details"}
          </PayoutFormSectionTitle>

          {methodType === "bank" ? (
            <PayoutFormGrid>
              <PayoutFormField>
                Account number
                <PayoutFormInput
                  value={accountNumber}
                  onChange={(event) => {
                    setAccountNumber(
                      event.target.value.replace(/[^\d\s]/g, ""),
                    );
                  }}
                  placeholder="Enter account number"
                  inputMode="numeric"
                  disabled={isPending}
                  $invalid={Boolean(visibleErrors.accountNumber)}
                  aria-invalid={Boolean(visibleErrors.accountNumber)}
                />
                {visibleErrors.accountNumber ? (
                  <PayoutFieldError>
                    {visibleErrors.accountNumber}
                  </PayoutFieldError>
                ) : null}
              </PayoutFormField>
              <PayoutFormField>
                Account holder name
                <PayoutFormInput
                  value={accountHolderName}
                  onChange={(event) => {
                    setAccountHolderName(event.target.value);
                  }}
                  placeholder="Enter account holder name"
                  disabled={isPending}
                  $invalid={Boolean(visibleErrors.accountHolderName)}
                  aria-invalid={Boolean(visibleErrors.accountHolderName)}
                />
                {visibleErrors.accountHolderName ? (
                  <PayoutFieldError>
                    {visibleErrors.accountHolderName}
                  </PayoutFieldError>
                ) : null}
              </PayoutFormField>
              <PayoutFormField>
                Bank name
                <PayoutFormInput
                  value={bankName}
                  onChange={(event) => {
                    setBankName(event.target.value);
                  }}
                  placeholder="Enter bank name"
                  disabled={isPending}
                  $invalid={Boolean(visibleErrors.bankName)}
                  aria-invalid={Boolean(visibleErrors.bankName)}
                />
                {visibleErrors.bankName ? (
                  <PayoutFieldError>{visibleErrors.bankName}</PayoutFieldError>
                ) : null}
              </PayoutFormField>
            </PayoutFormGrid>
          ) : (
            <PayoutFormGrid>
              <PayoutFormField>
                Card number
                <PayoutFormInput
                  value={cardNumber}
                  onChange={(event) => {
                    setCardNumber(formatAdminCardNumber(event.target.value));
                  }}
                  placeholder="Enter card number"
                  inputMode="numeric"
                  disabled={isPending}
                  $invalid={Boolean(visibleErrors.cardNumber)}
                  aria-invalid={Boolean(visibleErrors.cardNumber)}
                />
                {visibleErrors.cardNumber ? (
                  <PayoutFieldError>
                    {visibleErrors.cardNumber}
                  </PayoutFieldError>
                ) : null}
              </PayoutFormField>
              <PayoutFormField>
                Validity
                <PayoutFormInput
                  value={cardExpiry}
                  onChange={(event) => {
                    setCardExpiry(formatAdminCardExpiry(event.target.value));
                  }}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  disabled={isPending}
                  $invalid={Boolean(visibleErrors.cardExpiry)}
                  aria-invalid={Boolean(visibleErrors.cardExpiry)}
                />
                {visibleErrors.cardExpiry ? (
                  <PayoutFieldError>
                    {visibleErrors.cardExpiry}
                  </PayoutFieldError>
                ) : null}
              </PayoutFormField>
              <PayoutFormField>
                Card holder name
                <PayoutFormInput
                  value={accountHolderName}
                  onChange={(event) => {
                    setAccountHolderName(event.target.value);
                  }}
                  placeholder="Enter card holder name"
                  disabled={isPending}
                  $invalid={Boolean(visibleErrors.accountHolderName)}
                  aria-invalid={Boolean(visibleErrors.accountHolderName)}
                />
                {visibleErrors.accountHolderName ? (
                  <PayoutFieldError>
                    {visibleErrors.accountHolderName}
                  </PayoutFieldError>
                ) : null}
              </PayoutFormField>
            </PayoutFormGrid>
          )}
        </PayoutFormSection>

        <PayoutModalActions>
          <PayoutSecondaryButton
            type="button"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </PayoutSecondaryButton>
          <PayoutButton type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save details"}
          </PayoutButton>
        </PayoutModalActions>
      </PayoutForm>
    </Modal>
  );
}

export function AccountDetailsModal({
  creator,
  open,
  onClose,
}: AccountDetailsModalProps) {
  if (!open || !creator) return null;

  return (
    <AccountDetailsForm
      key={`${creator.creatorId}-${creator.accountDetails?.methodType ?? "new"}`}
      creator={creator}
      onClose={onClose}
    />
  );
}
