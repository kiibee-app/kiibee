"use client";

import React, { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import {
  COUPON_DISCOUNT_FIXED_AMOUNT,
  COUPON_DISCOUNT_PERCENTAGE,
  type CouponDiscountType,
} from "@/utils/common";
import {
  BackButton,
  FieldGroup,
  FieldLabel,
  FormShell,
  HelperText,
  ModalContent,
  ModalTitle,
  NextButton,
} from "../styles";
import { CouponInput, SectionTitle } from "./styles";
import { CouponFormState } from "@/types/collectionsType";
import { sanitizeDecimal, sanitizePercentage } from "@/utils/numericInput";

type CouponDetailsModalProps = {
  visible: boolean;
  form: CouponFormState;
  setForm: React.Dispatch<React.SetStateAction<CouponFormState>>;
  onClose: () => void;
  onNext: () => void;
};

export default function CouponDetailsModal({
  visible,
  form,
  setForm,
  onClose,
  onNext,
}: CouponDetailsModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const discountId = useId();
  const discountTypeOptions = useMemo(
    () => [
      {
        value: COUPON_DISCOUNT_FIXED_AMOUNT,
        label: t("contents.couponDetails.discountType.fixedAmount"),
      },
      {
        value: COUPON_DISCOUNT_PERCENTAGE,
        label: t("contents.couponDetails.discountType.percentage"),
      },
    ],
    [t],
  );

  const canContinue =
    form.title.trim().length > 0 && form.discountValue.trim().length > 0;

  const handleDiscountChange = (raw: string) => {
    const value =
      form.discountType === COUPON_DISCOUNT_PERCENTAGE
        ? sanitizePercentage(raw)
        : sanitizeDecimal(raw);
    setForm((prev) => ({ ...prev, discountValue: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) return;
    onNext();
  };

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      width="670px"
      height="480px"
      padding="20px"
      borderRadius="20px"
    >
      <ModalContent>
        <BackButton
          type="button"
          aria-label={t("common.back")}
          onClick={onClose}
        >
          <BackButtonIcon size={28} strokeWidth={2.5} />
        </BackButton>

        <FormShell onSubmit={handleSubmit}>
          <ModalTitle id="coupon-details-title">
            {t("contents.couponDetails.title")}
          </ModalTitle>

          <FieldGroup>
            <FieldLabel htmlFor={titleId}>
              {t("contents.couponDetails.fields.title")}
            </FieldLabel>
            <CouponInput
              id={titleId}
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder={t("contents.couponDetails.placeholders.title")}
            />
          </FieldGroup>

          <SectionTitle>
            {t("contents.couponDetails.discountValue")}
          </SectionTitle>
          <HelperText>{t("contents.couponDetails.discountHelp")}</HelperText>

          <DropdownField
            options={discountTypeOptions}
            value={form.discountType}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                discountType: value as CouponDiscountType,
              }))
            }
          />

          <CouponInput
            id={discountId}
            type="text"
            inputMode="decimal"
            value={form.discountValue}
            onChange={(e) => handleDiscountChange(e.target.value)}
            placeholder={t(
              form.discountType === COUPON_DISCOUNT_PERCENTAGE
                ? "contents.couponDetails.placeholders.discountPercentage"
                : "contents.couponDetails.placeholders.discountAmount",
            )}
          />

          <NextButton type="submit" disabled={!canContinue}>
            {t("common.next")}
          </NextButton>
        </FormShell>
      </ModalContent>
    </GenericModal>
  );
}
