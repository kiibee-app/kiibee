"use client";

import React, { useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import {
  CouponInput,
  BackButton,
  FieldGroup,
  FieldLabel,
  FormShell,
  HelperText,
  ModalContent,
  ModalTitle,
  NextButton,
  SectionTitle,
} from "./CouponDetailsModal.styles";

type CouponDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function CouponDetailsModal({
  visible,
  onClose,
}: CouponDetailsModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const discountId = useId();
  const [title, setTitle] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("fixedAmount");
  const discountTypeOptions = useMemo(
    () => [
      {
        value: "fixedAmount",
        label: t("contents.couponDetails.discountType.fixedAmount"),
      },
      {
        value: "percentage",
        label: t("contents.couponDetails.discountType.percentage"),
      },
    ],
    [t],
  );

  const canContinue =
    title.trim().length > 0 && discountValue.trim().length > 0;

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

        <FormShell onSubmit={(event) => event.preventDefault()}>
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
              value={title}
              placeholder={t("contents.couponDetails.placeholders.title")}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FieldGroup>

          <SectionTitle>
            {t("contents.couponDetails.discountValue")}
          </SectionTitle>
          <HelperText>{t("contents.couponDetails.discountHelp")}</HelperText>

          <DropdownField
            options={discountTypeOptions}
            value={discountType}
            onChange={setDiscountType}
          />

          <CouponInput
            id={discountId}
            type="text"
            inputMode="decimal"
            value={discountValue}
            placeholder={t(
              discountType === "percentage"
                ? "contents.couponDetails.placeholders.discountPercentage"
                : "contents.couponDetails.placeholders.discountAmount",
            )}
            onChange={(event) => setDiscountValue(event.target.value)}
          />

          <NextButton type="submit" disabled={!canContinue}>
            {t("common.next")}
          </NextButton>
        </FormShell>
      </ModalContent>
    </GenericModal>
  );
}
