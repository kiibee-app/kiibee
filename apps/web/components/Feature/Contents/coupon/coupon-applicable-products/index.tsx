"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import DropdownField from "@/components/UI/InputFields/DropdownField";
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
import { SelectorList, TitleHelperText } from "./styles";
import {
  COLLECTION_OPTIONS,
  CONTENT_OPTIONS,
} from "@/utils/dummyData/couponApplicableProducts";

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
  },
  {
    key: "contents",
    labelKey: "contents.couponApplicableProducts.fields.contents",
    helperKey: "contents.couponApplicableProducts.helpers.contents",
  },
] as const;

export default function CouponApplicableProductsModal({
  visible,
  onBack,
  onClose,
  onNext,
}: CouponApplicableProductsModalProps) {
  const { t } = useTranslation();
  const [selectedCollection, setSelectedCollection] = useState(
    COLLECTION_OPTIONS[0].value,
  );
  const [selectedContent, setSelectedContent] = useState(
    CONTENT_OPTIONS[0].value,
  );

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
                <DropdownField
                  options={
                    field.key === "collections"
                      ? COLLECTION_OPTIONS
                      : CONTENT_OPTIONS
                  }
                  showSelectedIndicator
                  value={
                    field.key === "collections"
                      ? selectedCollection
                      : selectedContent
                  }
                  onChange={(value) => {
                    if (field.key === "collections") {
                      setSelectedCollection(value);
                      return;
                    }
                    setSelectedContent(value);
                  }}
                />
              </FieldGroup>
            ))}
          </SelectorList>

          <NextButton type="submit">{t("common.next")}</NextButton>
        </FormShell>
      </ModalContent>
    </GenericModal>
  );
}
