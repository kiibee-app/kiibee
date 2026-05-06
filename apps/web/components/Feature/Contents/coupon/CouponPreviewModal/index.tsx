"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import {
  BackButton,
  FormShell,
  ModalContent,
  ModalTitle,
  NextButton,
} from "../styles";
import { CouponFormState } from "@/types/collectionsType";
import {
  COLLECTION_OPTIONS,
  CONTENT_OPTIONS,
} from "@/utils/dummyData/couponApplicableProducts";
import {
  Chip,
  ChipList,
  Section,
  SectionLabel,
  SectionRow,
  SectionValue,
  SelectorList,
} from "./styles";
import {
  COUPON_DISCOUNT_FIXED_AMOUNT,
  COUPON_DISCOUNT_PERCENTAGE,
} from "@/utils/common";

type Props = {
  visible: boolean;
  data: CouponFormState;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
};

export default function CouponPreviewModal({
  visible,
  data,
  onBack,
  onClose,
  onContinue,
}: Props) {
  const { t } = useTranslation();

  const getLabel = (
    value: string,
    options: { value: string; label: string }[],
  ) => options.find((opt) => opt.value === value)?.label || "-";
  const collectionLabel = getLabel(data.collection, COLLECTION_OPTIONS);
  const contentLabel = getLabel(data.content, CONTENT_OPTIONS);
  const codes = data.codes ? data.codes.split(",").map((c) => c.trim()) : [];

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

        <FormShell>
          <ModalTitle id="coupon-applicable-products-title">
            {t("contents.couponPreview.title")}
          </ModalTitle>
          <SelectorList>
            <Section>
              <SectionLabel>
                {t("contents.couponPreview.fields.title")}
              </SectionLabel>
              <SectionValue>{data.title}</SectionValue>
            </Section>
            <SectionRow>
              <Section>
                <SectionLabel>
                  {t("contents.couponPreview.fields.discountType")}
                </SectionLabel>
                <SectionValue>
                  {data.discountType === COUPON_DISCOUNT_PERCENTAGE
                    ? COUPON_DISCOUNT_PERCENTAGE
                    : COUPON_DISCOUNT_FIXED_AMOUNT}
                </SectionValue>
              </Section>

              <Section>
                <SectionLabel>
                  {t("contents.couponPreview.fields.amount")}
                </SectionLabel>
                <SectionValue>{data.discountValue}</SectionValue>
              </Section>
            </SectionRow>

            <Section>
              <SectionLabel>
                {t("contents.couponPreview.fields.codes")}
              </SectionLabel>
              <ChipList>
                {codes.length ? (
                  codes.map((code, i) => <Chip key={i}>{code}</Chip>)
                ) : (
                  <SectionValue>-</SectionValue>
                )}
              </ChipList>
            </Section>

            <Section>
              <SectionLabel>
                {t("contents.couponPreview.fields.applicableProducts")}
              </SectionLabel>
              <ChipList>
                {[collectionLabel, contentLabel].map((item, i) => (
                  <Chip key={i}>{item}</Chip>
                ))}
              </ChipList>
            </Section>
          </SelectorList>

          <NextButton onClick={onContinue} type="submit">
            {t("contents.couponPreview.confirm")}
          </NextButton>
        </FormShell>
      </ModalContent>
    </GenericModal>
  );
}
