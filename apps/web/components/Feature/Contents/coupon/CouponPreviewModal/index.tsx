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
  StatusBadge,
} from "../styles";

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
import { useAllContentsOptions } from "@/hooks/contents/useAllContentsOptions";
import { CollectionRow } from "@/types/collectionsType";
import { CouponEntity, CreateCouponPayload } from "@/types/couponType";
import { formatDateUSShort } from "@/utils/formatDate";
import { MODAL_ALIGN } from "@/utils/ui";
import { COUPON_MODE, CouponMode } from "@/utils/content";

type Props = {
  visible: boolean;
  data: CouponEntity | CreateCouponPayload;
  collections: CollectionRow[];
  onBack?: () => void;
  onClose?: () => void;
  onContinue?: () => Promise<void> | void;
  isSuccess?: boolean;
  mode?: CouponMode;
  onEdit?: () => void;
};

export default function CouponPreviewModal({
  visible,
  data,
  collections,
  onBack,
  onClose,
  onContinue,
  isSuccess = false,
  mode = COUPON_MODE.PREVIEW,
  onEdit,
}: Props) {
  const { t } = useTranslation();
  const { data: contentOptions = [] } = useAllContentsOptions(
    collections,
    visible,
  );

  const getLabel = (
    value: string,
    options: { value: string; label: string }[],
  ) => options.find((opt) => opt.value === value)?.label || "-";

  const collectionOptions = collections.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const isDetails = mode === COUPON_MODE.DETAILS;

  const collectionIds = isDetails
    ? ((data as CouponEntity).applicableProducts?.collectionIds ?? [])
    : ((data as CreateCouponPayload).collectionIds ?? []);

  const contentIds = isDetails
    ? ((data as CouponEntity).applicableProducts?.contentIds ?? [])
    : ((data as CreateCouponPayload).contentIds ?? []);

  const codes = data.codes ?? [];

  const collectionLabels =
    collectionIds.length > 0
      ? collectionIds.map((id) => getLabel(id, collectionOptions))
      : ["-"];

  const contentLabels =
    contentIds.length > 0
      ? contentIds.map((id) => getLabel(id, contentOptions))
      : ["-"];

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      iconMargin={isSuccess ? "0 auto 8px" : undefined}
      size="md"
      height="480px"
      spacing="xs"
      borderRadius="20px"
      textAlign={MODAL_ALIGN.START}
      title={isDetails ? t("contents.couponDetails.title") : undefined}
      onConfirm={isDetails ? onEdit : undefined}
      confirmLabel={
        isDetails ? t("contents.couponDetails.editButton") : undefined
      }
    >
      <ModalContent $details={isDetails}>
        {!isDetails && (
          <BackButton type={BUTTON} onClick={onBack}>
            <BackButtonIcon size={28} strokeWidth={2.5} />
          </BackButton>
        )}

        {!isSuccess && (
          <FormShell>
            {!isDetails && (
              <ModalTitle>{t("contents.couponPreview.title")}</ModalTitle>
            )}

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
              {isDetails && (
                <SectionRow>
                  <Section>
                    <SectionLabel>
                      {t("contents.couponDetails.createdDate")}
                    </SectionLabel>
                    <SectionValue>
                      {formatDateUSShort((data as CouponEntity).createdAt)}
                    </SectionValue>
                  </Section>

                  <Section>
                    <SectionLabel>
                      {t("contents.couponDetails.status")}
                    </SectionLabel>{" "}
                    <SectionValue>
                      <StatusBadge $status={(data as CouponEntity).status}>
                        <MonoText $use="Body_Bold">
                          {(data as CouponEntity).status}
                        </MonoText>
                      </StatusBadge>
                    </SectionValue>
                  </Section>
                </SectionRow>
              )}
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
                  {[...collectionLabels, ...contentLabels].map((item, i) => (
                    <Chip key={i}>{item}</Chip>
                  ))}
                </ChipList>
              </Section>
            </SelectorList>

            {!isDetails && (
              <NextButton onClick={onContinue} type="button">
                {t("contents.couponPreview.confirm")}
              </NextButton>
            )}
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
