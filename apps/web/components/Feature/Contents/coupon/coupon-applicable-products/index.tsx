"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowIcon, BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { Directions } from "@/utils/ui";
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
import { SelectorButton, SelectorList, TitleHelperText } from "./styles";

type CouponApplicableProductsModalProps = {
  visible: boolean;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
};

const applicableProductFields = [
  {
    key: "collections",
    labelKey: "contents.couponApplicableProducts.fields.collections",
    helperKey: "contents.couponApplicableProducts.helpers.collections",
    buttonKey: "contents.couponApplicableProducts.buttons.collections",
  },
  {
    key: "contents",
    labelKey: "contents.couponApplicableProducts.fields.contents",
    helperKey: "contents.couponApplicableProducts.helpers.contents",
    buttonKey: "contents.couponApplicableProducts.buttons.contents",
  },
] as const;

export default function CouponApplicableProductsModal({
  visible,
  onBack,
  onClose,
  onNext,
}: CouponApplicableProductsModalProps) {
  const { t } = useTranslation();

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
          <ModalTitle id="coupon-applicable-products-title">
            {t("contents.couponApplicableProducts.title")}
          </ModalTitle>
          <TitleHelperText>
            {t("contents.couponApplicableProducts.description")}
          </TitleHelperText>

          <SelectorList>
            {applicableProductFields.map((field) => (
              <FieldGroup key={field.key}>
                <FieldLabel>{t(field.labelKey)}</FieldLabel>
                <HelperText>{t(field.helperKey)}</HelperText>
                <SelectorButton type="button">
                  <span>{t(field.buttonKey)}</span>
                  <ArrowIcon
                    width={12}
                    height={6}
                    direction={Directions.RIGHT}
                  />
                </SelectorButton>
              </FieldGroup>
            ))}
          </SelectorList>

          <NextButton type="submit">{t("common.next")}</NextButton>
        </FormShell>
      </ModalContent>
    </GenericModal>
  );
}
