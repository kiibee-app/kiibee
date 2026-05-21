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
import { CollectionRow } from "@/types/collectionsType";
import { CONTENT_OPTIONS } from "@/utils/dummyData/couponApplicableProducts";
import {
  Chip,
  ChipList,
  Section,
  SectionLabel,
  SectionRow,
  SectionValue,
  SelectorList,
  UploadList,
} from "./styles";
import { COUPON_DISCOUNT_PERCENTAGE } from "@/utils/common";
import { MonoText } from "@/components/UI/Monotext";
import { BUTTON } from "@/utils/Constants";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";

type Props = {
  visible: boolean;
  data: CouponFormState;
  collections: CollectionRow[];
  onBack: () => void;
  onClose: () => void;
  onContinue: () => Promise<void> | void;
  isSuccess?: boolean;
};

export default function CouponPreviewModal({
  visible,
  data,
  collections,
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

  const collectionOptions = collections.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const collectionLabel = getLabel(data.collection, collectionOptions);
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
          type={BUTTON}
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
                      ? t("contents.couponDetails.discountType.percentage")
                      : t("contents.couponDetails.discountType.fixedAmount")}
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
                  {codes.map((code, i) => (
                    <Chip key={i}>{code}</Chip>
                  ))}
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
          <UploadList>
            <SuccessModalIcon />
            <MonoText $use="H5_Medium">
              {t("contents.couponPreview.uploading")}
            </MonoText>
          </UploadList>
        )}
      </ModalContent>
    </GenericModal>
  );
}
