"use client";

import React, { useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon, InfoIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import {
  COUPON_DISCOUNT_FIXED_AMOUNT,
  COUPON_DISCOUNT_PERCENTAGE,
  MAX_COUPON_PERCENTAGE_DISCOUNT,
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
import { CouponInput, SectionTitle, DiscountWarningNotice } from "./styles";
import { sanitizeDecimal, sanitizeDigits } from "@/utils/numericFields";
import { CreateCouponPayload } from "@/types/couponType";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";

type CouponDetailsModalProps = {
  visible: boolean;
  form: CreateCouponPayload;
  setForm: React.Dispatch<React.SetStateAction<CreateCouponPayload>>;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
};

export default function CouponDetailsModal({
  visible,
  form,
  setForm,
  onClose,
  onNext,
  onBack,
}: CouponDetailsModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const discountId = useId();
  const [percentageWarning, setPercentageWarning] = useState<string | null>(
    null,
  );
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (!visible) {
      setPercentageWarning(null);
    }
  }

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
    form.title.trim().length > 0 &&
    form.discountValue.trim().length > 0 &&
    !percentageWarning;

  const showPercentageLimitWarning = (max = MAX_COUPON_PERCENTAGE_DISCOUNT) => {
    setPercentageWarning(
      t("contents.couponDetails.maxPercentageError", { max }),
    );
  };

  const handleDiscountChange = (raw: string) => {
    if (form.discountType !== COUPON_DISCOUNT_PERCENTAGE) {
      setPercentageWarning(null);
      setForm((prev) => ({ ...prev, discountValue: sanitizeDecimal(raw) }));
      return;
    }

    const digits = sanitizeDigits(raw);
    if (!digits) {
      setPercentageWarning(null);
      setForm((prev) => ({ ...prev, discountValue: "" }));
      return;
    }

    const parsed = Number.parseInt(digits, 10);
    if (parsed > MAX_COUPON_PERCENTAGE_DISCOUNT) {
      setForm((prev) => ({ ...prev, discountValue: "" }));
      showPercentageLimitWarning();
      return;
    }

    setPercentageWarning(null);
    setForm((prev) => ({ ...prev, discountValue: digits }));
  };

  const handleDiscountTypeChange = (value: CouponDiscountType) => {
    if (value !== COUPON_DISCOUNT_PERCENTAGE) {
      setPercentageWarning(null);
      setForm((prev) => ({ ...prev, discountType: value }));
      return;
    }

    const digits = sanitizeDigits(form.discountValue);
    const parsed = digits ? Number.parseInt(digits, 10) : NaN;

    if (parsed > MAX_COUPON_PERCENTAGE_DISCOUNT) {
      showPercentageLimitWarning();
      setForm((prev) => ({ ...prev, discountType: value, discountValue: "" }));
      return;
    }

    setPercentageWarning(null);
    setForm((prev) => ({
      ...prev,
      discountType: value,
      discountValue: digits,
    }));
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
          onClick={onBack}
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
          <HelperText>
            {form.discountType === COUPON_DISCOUNT_PERCENTAGE
              ? t("contents.couponDetails.discountHelpPercentage", {
                  max: MAX_COUPON_PERCENTAGE_DISCOUNT,
                })
              : t("contents.couponDetails.discountHelp")}
          </HelperText>

          <DropdownField
            options={discountTypeOptions}
            value={form.discountType}
            onChange={(value) =>
              handleDiscountTypeChange(value as CouponDiscountType)
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
          {percentageWarning ? (
            <DiscountWarningNotice role="status">
              <InfoIcon size={16} />
              <MonoText $use="Body_Medium" color={COLORS.primary.ORANGE}>
                {percentageWarning}
              </MonoText>
            </DiscountWarningNotice>
          ) : null}

          <NextButton type="submit" disabled={!canContinue}>
            {t("common.next")}
          </NextButton>
        </FormShell>
      </ModalContent>
    </GenericModal>
  );
}
