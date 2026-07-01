"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import DatePickerField from "@/components/UI/InputFields/DatePickerField";
import { CreateCouponPayload } from "@/types/couponType";
import { BackButton, FieldGroup, ModalTitle, NextButton } from "../styles";
import {
  TitleHelperText,
  FieldsWrapper,
  ModalContent,
  FormShell,
} from "./styles";

type Props = {
  visible: boolean;
  form: CreateCouponPayload;
  setForm: React.Dispatch<React.SetStateAction<CreateCouponPayload>>;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
};

export default function CouponValidityModal({
  visible,
  form,
  setForm,
  onBack,
  onClose,
  onNext,
}: Props) {
  const { t } = useTranslation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNext();
  };

  const handleStartDateChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      startDate: val,
    }));
  };

  const handleEndDateChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      endDate: val,
    }));
  };

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      width="670px"
      height="577px"
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
          <ModalTitle id="coupon-validity-title">
            {t("contents.couponValidity.title")}
          </ModalTitle>
          <TitleHelperText>
            {t("contents.couponValidity.description")}
          </TitleHelperText>

          <FieldsWrapper>
            <FieldGroup>
              <DatePickerField
                label={t("contents.couponValidity.fields.startDate")}
                placeholder={t(
                  "contents.couponValidity.placeholders.startDate",
                )}
                value={form.startDate}
                onChange={handleStartDateChange}
              />
            </FieldGroup>

            <FieldGroup>
              <DatePickerField
                label={t("contents.couponValidity.fields.endDate")}
                placeholder={t("contents.couponValidity.placeholders.endDate")}
                value={form.endDate}
                onChange={handleEndDateChange}
              />
            </FieldGroup>
          </FieldsWrapper>

          <NextButton type="submit">{t("common.next")}</NextButton>
        </FormShell>
      </ModalContent>
    </GenericModal>
  );
}
