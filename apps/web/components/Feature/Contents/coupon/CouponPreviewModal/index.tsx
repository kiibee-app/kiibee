"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon, SuccessArcIcon } from "@/assets/icons"; // assume you have success icon
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
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";

type Props = {
  visible: boolean;
  data: CouponFormState;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => Promise<void> | void;
  isSuccess?: boolean;
};

export default function CouponPreviewModal({
  visible,
  data,
  onBack,
  onClose,
  onContinue,
  isSuccess = false,
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
      iconMargin={isSuccess ? "0 auto 8px" : undefined}
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

        {!isSuccess && (
          <FormShell>
            <ModalTitle>{t("contents.couponPreview.title")}</ModalTitle>

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

            <NextButton onClick={onContinue} type="button">
              {t("contents.couponPreview.confirm")}
            </NextButton>
          </FormShell>
        )}
        {isSuccess && (
          <SelectorList>
            <SuccessArcIcon
              width={40}
              height={40}
              color={COLORS.primary.GREEN_200}
            />
            <MonoText $use="H5_Medium">
              {t("contents.couponPreview.uploading")}
            </MonoText>
          </SelectorList>
        )}
      </ModalContent>
    </GenericModal>
  );
}
