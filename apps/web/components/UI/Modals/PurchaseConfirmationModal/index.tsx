import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import {
  ModalContentWrapper,
  ModalDescription,
} from "@/components/Feature/ProfileLayout/shared/LatestUpload/styles";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { MODAL_ALIGN } from "@/utils/ui";
import {
  PurchaseModalCard,
  PurchaseModalCardHeader,
  PurchaseModalCardHeaderLabel,
  PurchaseModalCardBody,
  PurchaseModalCardImage,
  PurchaseModalCardInfo,
  PurchaseModalCardBadge,
  PurchaseModalCardTitle,
  PurchaseModalCardCreator,
  PurchaseModalCardPrice,
} from "./styles";

export type PurchaseConfirmationModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  image?: string;
  imageAlt?: string;
  creator?: string;
  contentType?: string;
  priceLabel: string;
  accessLabel?: string;
  loading?: boolean;
};

export default function PurchaseConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  image,
  imageAlt,
  creator,
  contentType,
  priceLabel,
  accessLabel,
  loading = false,
}: PurchaseConfirmationModalProps) {
  const { t } = useTranslation();
  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      size="md"
      spacing="start"
      showCloseButton
      textAlign={MODAL_ALIGN.CENTER}
    >
      <ModalContentWrapper>
        <MonoText $use="Heading3">
          {t("createProfileHome.latestUpload.purchaseConfirmationModal.title")}
        </MonoText>
        <ModalDescription
          $use="Body_Medium"
          style={{ marginTop: "12px", marginBottom: "24px" }}
        >
          {t(
            "createProfileHome.latestUpload.purchaseConfirmationModal.message",
          )}
        </ModalDescription>

        <PurchaseModalCard style={{ textAlign: "left" }}>
          <PurchaseModalCardHeader>
            <PurchaseModalCardHeaderLabel>
              {accessLabel ||
                t(
                  "createProfileHome.latestUpload.purchaseConfirmationModal.defaultAccessLabel",
                )}
            </PurchaseModalCardHeaderLabel>
          </PurchaseModalCardHeader>

          <PurchaseModalCardBody>
            {image ? (
              <PurchaseModalCardImage>
                <Image src={image} alt={imageAlt || title} fill sizes="120px" />
              </PurchaseModalCardImage>
            ) : null}

            <PurchaseModalCardInfo>
              <PurchaseModalCardBadge>
                <MonoText $use="Body_Bold">
                  {contentType?.toUpperCase() || "PDF"}
                </MonoText>
              </PurchaseModalCardBadge>
              <PurchaseModalCardTitle>
                <MonoText $use="Body_Bold">{title}</MonoText>
              </PurchaseModalCardTitle>
              {creator ? (
                <PurchaseModalCardCreator>
                  <MonoText $use="Body_Medium">{creator}</MonoText>
                </PurchaseModalCardCreator>
              ) : null}
              <PurchaseModalCardPrice>
                <MonoText $use="Body_Bold">{priceLabel}</MonoText>
              </PurchaseModalCardPrice>
            </PurchaseModalCardInfo>
          </PurchaseModalCardBody>
        </PurchaseModalCard>

        <GenericButton
          variant={VARIANT.PRIMARY}
          fullWidth
          onClick={onConfirm}
          disabled={loading}
          isLoading={loading}
        >
          {t(
            "createProfileHome.latestUpload.purchaseConfirmationModal.continueLabel",
          )}
        </GenericButton>
      </ModalContentWrapper>
    </GenericModal>
  );
}
