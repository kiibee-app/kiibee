"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon, ChipCloseIcon } from "@/assets/icons";
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
import {
  SelectorList,
  TitleHelperText,
  SelectedValueChip,
  SelectedValueText,
  ChipCloseCircle,
  SelectedChipWrapper,
} from "./styles";
import { COUPON_APPLICABLE_PRODUCTS_FIELD_KEYS } from "@/utils/couponApplicableProducts";
import { CollectionRow } from "@/types/collectionsType";
import { useAllContentsOptions } from "@/hooks/contents/useAllContentsOptions";
import { CreateCouponPayload } from "@/types/couponType";

type CouponApplicableProductsModalProps = {
  visible: boolean;
  form: CreateCouponPayload;
  collections: CollectionRow[];
  setForm: React.Dispatch<React.SetStateAction<CreateCouponPayload>>;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
};

const applicableProductFields = [
  {
    key: COUPON_APPLICABLE_PRODUCTS_FIELD_KEYS.COLLECTIONS,
    labelKey: "contents.couponApplicableProducts.fields.collections",
    helperKey: "contents.couponApplicableProducts.helpers.collections",
  },
  {
    key: COUPON_APPLICABLE_PRODUCTS_FIELD_KEYS.CONTENTS,
    labelKey: "contents.couponApplicableProducts.fields.contents",
    helperKey: "contents.couponApplicableProducts.helpers.contents",
  },
] as const;

export default function CouponApplicableProductsModal({
  visible,
  form,
  collections,
  setForm,
  onBack,
  onClose,
  onNext,
}: CouponApplicableProductsModalProps) {
  const { t } = useTranslation();
  const collectionOptions = collections.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const { data: contentOptions = [] } = useAllContentsOptions(
    collections,
    visible,
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNext();
  };

  const handleApplicableProductChange = (fieldKey: string, value: string[]) => {
    if (fieldKey === COUPON_APPLICABLE_PRODUCTS_FIELD_KEYS.COLLECTIONS) {
      setForm((prev) => ({
        ...prev,
        collectionIds: value,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      contentIds: value,
    }));
  };

  const handleRemoveSelected = (fieldKey: string, id: string) => {
    if (fieldKey === COUPON_APPLICABLE_PRODUCTS_FIELD_KEYS.COLLECTIONS) {
      setForm((prev) => ({
        ...prev,
        collectionIds: (prev.collectionIds ?? []).filter((v) => v !== id),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      contentIds: (prev.contentIds ?? []).filter((v) => v !== id),
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
                    field.key ===
                    COUPON_APPLICABLE_PRODUCTS_FIELD_KEYS.COLLECTIONS
                      ? collectionOptions
                      : contentOptions
                  }
                  multi
                  showSelectedIndicator
                  renderSelectedValues={(selected) => (
                    <SelectedChipWrapper>
                      {selected.length > 0 ? (
                        selected.map((opt) => (
                          <SelectedValueChip key={opt.value}>
                            <SelectedValueText>
                              {opt.label || opt.labelKey || opt.value}
                            </SelectedValueText>
                            <ChipCloseCircle
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemoveSelected(field.key, opt.value);
                              }}
                              aria-label={t("common.close")}
                            >
                              <ChipCloseIcon />
                            </ChipCloseCircle>
                          </SelectedValueChip>
                        ))
                      ) : (
                        <span>
                          {field.key ===
                          COUPON_APPLICABLE_PRODUCTS_FIELD_KEYS.COLLECTIONS
                            ? t(
                                "contents.couponApplicableProducts.buttons.collections",
                              )
                            : t(
                                "contents.couponApplicableProducts.buttons.contents",
                              )}
                        </span>
                      )}
                    </SelectedChipWrapper>
                  )}
                  value={
                    field.key ===
                    COUPON_APPLICABLE_PRODUCTS_FIELD_KEYS.COLLECTIONS
                      ? form.collectionIds
                      : form.contentIds
                  }
                  onChange={(value) =>
                    handleApplicableProductChange(field.key, value)
                  }
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
