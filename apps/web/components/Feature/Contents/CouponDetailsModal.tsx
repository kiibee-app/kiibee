"use client";

import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowIcon, BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import COLORS from "@repo/ui/colors";
import { Directions } from "@/utils/ui";
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
  SelectButton,
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

          <SelectButton type="button" aria-haspopup="listbox">
            <span>{t("contents.couponDetails.discountType.fixedAmount")}</span>
            <ArrowIcon
              width={8}
              height={5}
              color={COLORS.neutral.GRAY}
              direction={Directions.RIGHT}
            />
          </SelectButton>

          <CouponInput
            id={discountId}
            type="text"
            inputMode="decimal"
            value={discountValue}
            placeholder={t(
              "contents.couponDetails.placeholders.discountAmount",
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
