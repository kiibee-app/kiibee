"use client";

import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { COUPON_CODES_LIMIT } from "@/utils/common";
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
import {
  CodesHelperText,
  CodesLimitText,
  CodesMetaRow,
  CouponCodesInput,
} from "./styles";

type CouponCodesModalProps = {
  visible: boolean;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
};

export default function CouponCodesModal({
  visible,
  onBack,
  onClose,
  onNext,
}: CouponCodesModalProps) {
  const { t } = useTranslation();
  const codesId = useId();
  const helperId = useId();
  const [codes, setCodes] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          <ModalTitle id="coupon-codes-title">
            {t("contents.couponCodes.title")}
          </ModalTitle>

          <FieldGroup>
            <FieldLabel htmlFor={codesId}>
              {t("contents.couponCodes.fields.discountCodes")}
            </FieldLabel>
            <HelperText>{t("contents.couponCodes.description")}</HelperText>
            <CouponCodesInput
              id={codesId}
              value={codes}
              maxLength={COUPON_CODES_LIMIT}
              aria-describedby={helperId}
              placeholder={t("contents.couponCodes.placeholders.codes")}
              onChange={(event) => setCodes(event.target.value)}
            />
            <CodesMetaRow id={helperId}>
              <CodesHelperText>
                {t("contents.couponCodes.helper")}
              </CodesHelperText>
              <CodesLimitText>{COUPON_CODES_LIMIT}</CodesLimitText>
            </CodesMetaRow>
          </FieldGroup>

          <NextButton type="submit">{t("common.next")}</NextButton>
        </FormShell>
      </ModalContent>
    </GenericModal>
  );
}
