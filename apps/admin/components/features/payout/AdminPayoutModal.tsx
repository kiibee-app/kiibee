"use client";

import { useMemo, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Modal } from "../../common/Modal";
import {
  useAdminPayoutCalculate,
  useAdminPayoutRequest,
} from "../../../hooks/api";
import type { CreatorWalletItem } from "../../../types/payout-request";
import { formatAmount, MIN_PAYOUT_AMOUNT } from "../../../utils/payout";
import {
  PayoutButton,
  PayoutFeeList,
  PayoutFeeRow,
  PayoutFeeTotal,
  PayoutForm,
  PayoutFormField,
  PayoutFormInput,
  PayoutFormSelect,
  PayoutHint,
  PayoutModalActions,
  PayoutSecondaryButton,
} from "./PayoutDashboard.styles";

type AdminPayoutModalProps = {
  creator: CreatorWalletItem | null;
  open: boolean;
  onClose: () => void;
};

function getDefaultPaymentMethodId(creator: CreatorWalletItem) {
  const preferred =
    creator.paymentMethods.find((method) => method.isDefault) ??
    creator.paymentMethods[0];
  return preferred?.id ?? "";
}

function AdminPayoutForm({
  creator,
  onClose,
}: {
  creator: CreatorWalletItem;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(creator.walletBalance);
  const [paymentMethodId, setPaymentMethodId] = useState(() =>
    getDefaultPaymentMethodId(creator),
  );
  const calculateQuery = useAdminPayoutCalculate(creator.creatorId, true);
  const { mutate: submitPayout, isPending } = useAdminPayoutRequest();

  const paymentMethods = creator.paymentMethods;
  const calculation = calculateQuery.data;
  const balance = Number(creator.walletBalance);
  const parsedAmount = Number(amount);
  const amountValid =
    Number.isFinite(parsedAmount) &&
    parsedAmount > MIN_PAYOUT_AMOUNT &&
    parsedAmount <= balance;
  const canSubmit =
    amountValid &&
    Boolean(paymentMethodId) &&
    paymentMethods.length > 0 &&
    !isPending &&
    balance > MIN_PAYOUT_AMOUNT;

  const feePreview = useMemo(() => {
    if (!calculation || !amountValid) return null;

    const platformFeePercentage = calculation.platformFeePercentage;
    const processingFeePercentage = calculation.processingFeePercentage;
    const platformFee = Number(
      (parsedAmount * platformFeePercentage).toFixed(2),
    );
    const processingFee = Number(
      (parsedAmount * processingFeePercentage).toFixed(2),
    );
    const payableAmount = Number(
      (parsedAmount - platformFee - processingFee).toFixed(2),
    );

    return {
      amount: parsedAmount,
      platformFeePercentage,
      processingFeePercentage,
      platformFee,
      processingFee,
      payableAmount,
      walletCurrency: calculation.walletCurrency,
    };
  }, [amountValid, calculation, parsedAmount]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const getSuccessMessage = (result?: {
    processed?: boolean;
    requestCreated?: boolean;
  }) => {
    if (result?.processed) {
      return "Payout processed successfully. The creator has been notified by email.";
    }

    if (result?.requestCreated) {
      return "Payout request created. Review it under Payout Requests.";
    }

    return "Payout processed successfully.";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    submitPayout(
      {
        creatorId: creator.creatorId,
        paymentMethodId,
        amount: parsedAmount,
        processImmediately: true,
      },
      {
        onSuccess: (result) => {
          toast.success(getSuccessMessage(result));
          onClose();
        },
        onError: ({ message }) => {
          toast.error(message || "Failed to process payout.");
        },
      },
    );
  };

  return (
    <Modal
      title={`Process payout · ${creator.fullName || "Creator"}`}
      open
      onClose={handleClose}
    >
      <PayoutForm onSubmit={handleSubmit}>
        <PayoutHint>
          Available balance:{" "}
          {formatAmount(creator.walletBalance, creator.walletCurrency)}
        </PayoutHint>

        <PayoutFormField>
          Amount ({creator.walletCurrency})
          <PayoutFormInput
            type="number"
            min={MIN_PAYOUT_AMOUNT + 0.01}
            step="0.01"
            max={creator.walletBalance}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </PayoutFormField>

        <PayoutFormField>
          Payment method
          {paymentMethods.length ? (
            <PayoutFormSelect
              value={paymentMethodId}
              onChange={(event) => setPaymentMethodId(event.target.value)}
              required
            >
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.label}
                  {method.type === "bank" ? " (Bank)" : " (Card)"}
                </option>
              ))}
            </PayoutFormSelect>
          ) : (
            <PayoutHint>
              This creator has no bank account or card on file.
            </PayoutHint>
          )}
        </PayoutFormField>

        {calculateQuery.isLoading ? (
          <PayoutHint>Calculating fees...</PayoutHint>
        ) : null}

        {calculateQuery.isError ? (
          <PayoutHint>
            {calculateQuery.error?.message ||
              "Unable to preview fees for this balance."}
          </PayoutHint>
        ) : null}

        {feePreview ? (
          <PayoutFeeList>
            <PayoutFeeRow>
              <span>Gross amount</span>
              <span>
                {formatAmount(feePreview.amount, feePreview.walletCurrency)}
              </span>
            </PayoutFeeRow>
            <PayoutFeeRow>
              <span>
                Platform fee (
                {(feePreview.platformFeePercentage * 100).toFixed(0)}%)
              </span>
              <span>
                -
                {formatAmount(
                  feePreview.platformFee,
                  feePreview.walletCurrency,
                )}
              </span>
            </PayoutFeeRow>
            <PayoutFeeRow>
              <span>
                Processing fee (
                {(feePreview.processingFeePercentage * 100).toFixed(0)}%)
              </span>
              <span>
                -
                {formatAmount(
                  feePreview.processingFee,
                  feePreview.walletCurrency,
                )}
              </span>
            </PayoutFeeRow>
            <PayoutFeeTotal>
              <span>Net payout</span>
              <span>
                {formatAmount(
                  feePreview.payableAmount,
                  feePreview.walletCurrency,
                )}
              </span>
            </PayoutFeeTotal>
          </PayoutFeeList>
        ) : null}

        {!amountValid && amount ? (
          <PayoutHint>
            Enter an amount greater than {MIN_PAYOUT_AMOUNT} DKK and up to the
            available balance. A payment method is required.
          </PayoutHint>
        ) : null}

        <PayoutModalActions>
          <PayoutSecondaryButton
            type="button"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </PayoutSecondaryButton>
          <PayoutButton type="submit" disabled={!canSubmit}>
            {isPending ? "Processing..." : "Process payout"}
          </PayoutButton>
        </PayoutModalActions>
      </PayoutForm>
    </Modal>
  );
}

export function AdminPayoutModal({
  creator,
  open,
  onClose,
}: AdminPayoutModalProps) {
  if (!open || !creator) return null;

  return (
    <AdminPayoutForm
      key={creator.creatorId}
      creator={creator}
      onClose={onClose}
    />
  );
}
