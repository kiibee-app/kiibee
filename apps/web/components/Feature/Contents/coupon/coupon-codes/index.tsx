"use client";

import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { COUPON_CODES_LIMIT } from "@/utils/common";
import TagsInput from "@/components/UI/InputFields/TagsInput";
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
import { CodesHelperText, CodesLimitText, CodesMetaRow } from "./styles";
import { CreateCouponPayload } from "@/types/couponType";

type CouponCodesModalProps = {
  visible: boolean;
  form: CreateCouponPayload;
  setForm: React.Dispatch<React.SetStateAction<CreateCouponPayload>>;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
};

export default function CouponCodesModal({
  visible,
  form,
  setForm,
  onBack,
  onClose,
  onNext,
}: CouponCodesModalProps) {
  const { t } = useTranslation();
  const codesId = useId();
  const helperId = useId();
  const currentCount = form.codes?.length || 0;
  const isLimitExceeded = currentCount > COUPON_CODES_LIMIT;
  const canContinue = currentCount > 0 && !isLimitExceeded;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) return;
    onNext();
  };

  const handleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      codes: value
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    }));
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
            <TagsInput
              value={form.codes?.join(", ") || ""}
              onChange={handleChange}
              placeholder={t("contents.couponCodes.placeholders.codes")}
              maxLength={2000}
              hasError={isLimitExceeded}
              separateOnSpace={true}
            />
            <CodesMetaRow id={helperId}>
              <CodesHelperText>
                {t("contents.couponCodes.helper")}
              </CodesHelperText>
              <CodesLimitText $hasError={isLimitExceeded}>
                {`${currentCount} / ${COUPON_CODES_LIMIT}`}
              </CodesLimitText>
            </CodesMetaRow>
          </FieldGroup>

          <NextButton type="submit" disabled={!canContinue}>
            {t("common.next")}
          </NextButton>
        </FormShell>
      </ModalContent>
    </GenericModal>
  );
}
