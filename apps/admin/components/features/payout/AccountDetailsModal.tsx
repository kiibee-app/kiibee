"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Modal } from "../../common/Modal";
import { MODAL_SIZE } from "../../../utils/constants";
import { useUpsertAdminAccountDetails } from "../../../hooks/api";
import type { CreatorWalletItem } from "../../../types/payout-request";
import {
  MethodToggle,
  MethodToggleButton,
  PayoutButton,
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

type MethodType = "bank" | "card";

function AccountDetailsForm({
  creator,
  onClose,
}: {
  creator: CreatorWalletItem;
  onClose: () => void;
}) {
  const existing = creator.accountDetails;
  const [methodType, setMethodType] = useState<MethodType>(
    existing?.methodType ?? "bank",
  );
  const [accountNumber, setAccountNumber] = useState(
    existing?.accountNumber ?? "",
  );
  const [accountHolderName, setAccountHolderName] = useState(
    existing?.accountHolderName ?? "",
  );
  const [bankName, setBankName] = useState(existing?.bankName ?? "");
  const [cardNumber, setCardNumber] = useState(existing?.cardNumber ?? "");
  const [cardExpiry, setCardExpiry] = useState(existing?.cardExpiry ?? "");
  const { mutate: saveDetails, isPending } = useUpsertAdminAccountDetails();

  const canSubmitBank =
    accountNumber.trim() && accountHolderName.trim() && bankName.trim();

  const canSubmitCard =
    cardNumber.trim() && cardExpiry.trim() && accountHolderName.trim();

  const canSubmit =
    !isPending && (methodType === "bank" ? canSubmitBank : canSubmitCard);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    saveDetails(
      {
        creatorId: creator.creatorId,
        methodType,
        accountHolderName: accountHolderName.trim(),
        ...(methodType === "bank"
          ? {
              accountNumber: accountNumber.trim(),
              bankName: bankName.trim(),
            }
          : {
              cardNumber: cardNumber.trim(),
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
      <PayoutForm onSubmit={handleSubmit}>
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
            onClick={() => setMethodType("bank")}
          >
            Bank account
          </MethodToggleButton>
          <MethodToggleButton
            type="button"
            role="tab"
            $active={methodType === "card"}
            aria-selected={methodType === "card"}
            disabled={isPending}
            onClick={() => setMethodType("card")}
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
                  onChange={(event) => setAccountNumber(event.target.value)}
                  placeholder="Enter account number"
                  required
                  disabled={isPending}
                />
              </PayoutFormField>
              <PayoutFormField>
                Account holder name
                <PayoutFormInput
                  value={accountHolderName}
                  onChange={(event) => setAccountHolderName(event.target.value)}
                  placeholder="Enter account holder name"
                  required
                  disabled={isPending}
                />
              </PayoutFormField>
              <PayoutFormField>
                Bank name
                <PayoutFormInput
                  value={bankName}
                  onChange={(event) => setBankName(event.target.value)}
                  placeholder="Enter bank name"
                  required
                  disabled={isPending}
                />
              </PayoutFormField>
            </PayoutFormGrid>
          ) : (
            <PayoutFormGrid>
              <PayoutFormField>
                Card number
                <PayoutFormInput
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  placeholder="Enter card number"
                  required
                  disabled={isPending}
                />
              </PayoutFormField>
              <PayoutFormField>
                Validity
                <PayoutFormInput
                  value={cardExpiry}
                  onChange={(event) => setCardExpiry(event.target.value)}
                  placeholder="MM/YY"
                  required
                  disabled={isPending}
                />
              </PayoutFormField>
              <PayoutFormField>
                Card holder name
                <PayoutFormInput
                  value={accountHolderName}
                  onChange={(event) => setAccountHolderName(event.target.value)}
                  placeholder="Enter card holder name"
                  required
                  disabled={isPending}
                />
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
          <PayoutButton type="submit" disabled={!canSubmit}>
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
