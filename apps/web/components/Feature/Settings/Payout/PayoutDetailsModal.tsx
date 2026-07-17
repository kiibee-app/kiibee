"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { GenericModal } from "@/components/UI/Modals";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { PayoutWrapper, Row, Divider, FooterNote } from "./styles";
import {
  formatFeePercent,
  formatPayoutNumber,
  isPayoutBalanceError,
  type PayoutRow,
} from "@/utils/payout";
import { MODAL_ALIGN } from "@/utils/ui";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { usePayoutCalculate } from "@/hooks/usePayoutCalculate";
import { usePayoutRequest } from "@/hooks/usePayoutRequest";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { API, useGetAPI } from "@/lib/http/api";
import type { GetCreatorProfileResponse } from "@/hooks/auth/creatorProfileApi";
import { useCreatorPaymentMethods } from "@/hooks/useCreatorPaymentMethods";

type Props = {
  open: boolean;
  onClose: () => void;
  purchases: number;
  rentals: number;
};

export default function PayoutDetailsModal({
  open,
  onClose,
  purchases,
  rentals,
}: Props) {
  const { t } = useTranslation();
  const { getErrorMessage } = useApiErrorMessage();
  const { calculation, isLoading, isError, error } = usePayoutCalculate(open);
  const { requestPayout, isPending } = usePayoutRequest();
  const { paymentMethods, isLoading: isPaymentMethodsLoading } =
    useCreatorPaymentMethods();

  const profileQuery = useGetAPI<GetCreatorProfileResponse>(
    API.auth.creatorProfile,
    undefined,
    {
      enabled: open,
      retry: false,
    },
  );

  const bankAccount = profileQuery.data?.data?.bankAccount;
  const isProfileLoading =
    profileQuery.isLoading ||
    profileQuery.isFetching ||
    isPaymentMethodsLoading;
  const isBusy = isLoading || isProfileLoading;

  const paymentOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    if (bankAccount?.id) {
      options.push({
        value: bankAccount.id,
        label: t("settings.payoutMethods.bankAccountLabel", "Bank Account"),
      });
    }
    paymentMethods.forEach((pm) => {
      if (!pm.paymentMethodId) return;

      options.push({
        value: pm.paymentMethodId,
        label: `${pm.brand} ${pm.label}`,
      });
    });
    return options;
  }, [bankAccount, paymentMethods, t]);

  const [selectedMethodId, setSelectedMethodId] = useState<string>("");

  const defaultMethodId = useMemo(() => {
    const defaultPaymentMethod = paymentMethods.find((p) => p.isDefault);
    return (
      defaultPaymentMethod?.paymentMethodId ?? paymentOptions[0]?.value ?? ""
    );
  }, [paymentMethods, paymentOptions]);

  const selectedOptionExists = paymentOptions.some(
    (option) => option.value === selectedMethodId,
  );
  const activeMethodId = selectedOptionExists
    ? selectedMethodId
    : defaultMethodId;

  const handleClose = () => {
    setSelectedMethodId("");
    onClose();
  };

  const payoutRows = useMemo((): PayoutRow[] => {
    if (!calculation) return [];

    return [
      {
        label: t("settings.payout.modal.earnings", {
          purchases,
          rentals,
        }),
        value: formatPayoutNumber(calculation.amount),
      },
      {
        label: t("settings.payout.modal.processingFee", {
          percent: formatFeePercent(calculation.processingFeePercentage),
        }),
        value: formatPayoutNumber(-calculation.processingFee),
      },
      {
        label: t("settings.payout.modal.platformFee", {
          percent: formatFeePercent(calculation.platformFeePercentage),
        }),
        value: formatPayoutNumber(-calculation.platformFee),
      },
    ];
  }, [calculation, purchases, rentals, t]);

  const totalValue = calculation
    ? formatPayoutNumber(calculation.payableAmount)
    : "";

  const calcErrorMessage = (() => {
    if (!isError) return "";

    if (isPayoutBalanceError(error?.message)) {
      return t("settings.payout.zeroBalanceModal.message");
    }

    return getErrorMessage(error, "settings.payout.modal.calculateError");
  })();

  const canConfirm =
    !!calculation &&
    calculation.payableAmount > 0 &&
    !!activeMethodId &&
    !isBusy &&
    !isPending;

  const handleConfirm = async () => {
    if (!calculation || !activeMethodId) {
      toast.error(
        t(
          activeMethodId
            ? "settings.payout.modal.calculateError"
            : "settings.payout.modal.missingBankAccount",
        ),
      );
      return;
    }

    try {
      await requestPayout({
        amount: calculation.amount,
        paymentMethodId: activeMethodId,
      });
      toast.success(t("settings.payout.modal.success"));
      handleClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "settings.payout.modal.requestError"));
    }
  };

  return (
    <GenericModal
      visible={open}
      title={t("settings.payout.modal.title")}
      textAlign={MODAL_ALIGN.START}
      confirmLabel={`${t("settings.payout.title")}${totalValue ? ` ${totalValue}` : ""}`}
      cancelLabel={t("common.cancel")}
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      closeOnConfirm={false}
      confirmDisabled={!canConfirm}
      confirmLoading={isPending}
      size="md"
      buttonRow
      buttonAlign={MODAL_ALIGN.END}
    >
      <PayoutWrapper>
        {isBusy && (
          <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY_400}>
            {t("settings.payout.modal.loading")}
          </MonoText>
        )}

        {!isBusy && calcErrorMessage && (
          <MonoText $use="Body_Regular" color={COLORS.primary.RED}>
            {calcErrorMessage}
          </MonoText>
        )}

        {!isBusy && !isError && paymentOptions.length === 0 && (
          <MonoText $use="Body_Regular" color={COLORS.primary.RED}>
            {t("settings.payout.modal.missingBankAccount")}
          </MonoText>
        )}

        {!isBusy && paymentOptions.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <DropdownField
              label={t(
                "settings.payout.modal.selectMethod",
                "Select Payout Method",
              )}
              options={paymentOptions}
              value={activeMethodId}
              onChange={(val) => setSelectedMethodId(val)}
            />
          </div>
        )}

        {!isBusy &&
          payoutRows.map((item) => (
            <Row key={item.label}>
              <MonoText
                $use="Body_SemiBold"
                color={COLORS.neutral.GRAY_400}
                style={{ whiteSpace: "pre-line" }}
              >
                {item.label}
              </MonoText>
              <MonoText $use="Body_Regular">{item.value}</MonoText>
            </Row>
          ))}

        {!isBusy && calculation && (
          <>
            <Divider />

            <FooterNote>
              <MonoText $use="H4_SemiBold" color={COLORS.neutral.GRAY_400}>
                {t("settings.payout.modal.total")}
              </MonoText>
              <MonoText $use="H4_Medium">{totalValue}</MonoText>
            </FooterNote>
          </>
        )}
      </PayoutWrapper>
    </GenericModal>
  );
}
