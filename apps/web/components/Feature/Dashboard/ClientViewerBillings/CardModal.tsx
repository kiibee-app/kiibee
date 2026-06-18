"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import InputField from "@/components/UI/InputFields";
import { INPUT_TYPE, MODAL_ALIGN } from "@/utils/ui";
import { INPUT_VARIANTS, CARD_BRANDS } from "@/utils/Constants";
import { NUMERIC_INPUT_MODE } from "@/utils/numericFields";
import { CardIcon } from "@/assets/icons";
import { useCardForm } from "@/hooks/useCardForm";
import {
  CARD_BRAND_LOGOS,
  type CardFormPayload,
  type ViewerPaymentMethod,
} from "@/types/cardTypes";
import SafeImage from "@/components/UI/SafeImage";
import {
  CardIconBox,
  Container,
  ErrorText,
  FieldWrapper,
  Grid,
} from "./styles";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";

type CardModalProps = {
  mode: "add" | "edit";
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: CardFormPayload) => Promise<void>;
  paymentMethod?: ViewerPaymentMethod;
};

export default function CardModal({
  mode,
  visible,
  onClose,
  onSubmit,
  paymentMethod,
}: CardModalProps) {
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const modalKeys = isEdit
    ? DASHBOARD_VIEWER_BILLINGS.paymentMethods.editCardModal
    : DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal;

  const {
    cardNumber,
    expiryDate,
    securityCode,
    errors,
    successOpen,
    setSuccessOpen,
    isSubmitting,
    isFormValid,
    handleSubmit,
    handleClose,
    handleCardNumberChange,
    handleExpiryChange,
    handleCVVChange,
  } = useCardForm({
    mode,
    visible,
    paymentMethod,
    onClose,
    onSubmit,
  });

  const cardIcon = isEdit && paymentMethod ? (
    <CardIconBox>
      <SafeImage
        src={CARD_BRAND_LOGOS[paymentMethod.brand]}
        alt={paymentMethod.brand}
        width={paymentMethod.brand === CARD_BRANDS.VISA ? 26 : 20}
        height={paymentMethod.brand === CARD_BRANDS.VISA ? 8 : 14}
      />
    </CardIconBox>
  ) : (
    <CardIcon width={20} height={20} />
  );

  return (
    <>
      <GenericModal
        visible={visible}
        title={t(modalKeys.title)}
        cancelLabel={t("common.cancel")}
        confirmLabel={isEdit ? t("common.save") : t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCard)}
        onCancel={handleClose}
        onClose={handleClose}
        onConfirm={handleSubmit}
        size="md"
        spacing="start"
        buttonRow
        buttonAlign={MODAL_ALIGN.END}
        textAlign={MODAL_ALIGN.START}
        contentMarginBottom="30px"
        confirmDisabled={!isFormValid || isSubmitting}
      >
        <Container>
          <FieldWrapper>
            <InputField
              label={t(modalKeys.cardNumber)}
              type={INPUT_TYPE.TEXT}
              inputMode={NUMERIC_INPUT_MODE}
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder={t(modalKeys.cardPlaceholder)}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              height="40px"
              hasError={!!errors.cardNumber}
              icon={cardIcon}
              labelMarginTop="0"
            />

            {errors.cardNumber && <ErrorText>{errors.cardNumber}</ErrorText>}
          </FieldWrapper>

          <Grid>
            <FieldWrapper>
              <InputField
                label={t(modalKeys.expiryDate)}
                type={INPUT_TYPE.TEXT}
                inputMode={NUMERIC_INPUT_MODE}
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder={t(modalKeys.expiryPlaceholder)}
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                height="40px"
                hasError={!!errors.expiryDate}
                labelMarginTop="0"
              />

              {errors.expiryDate && <ErrorText>{errors.expiryDate}</ErrorText>}
            </FieldWrapper>

            <FieldWrapper>
              <InputField
                label={t(modalKeys.cvv)}
                type={INPUT_TYPE.TEXT}
                inputMode={NUMERIC_INPUT_MODE}
                value={securityCode}
                onChange={handleCVVChange}
                placeholder={t(modalKeys.cvvPlaceholder)}
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                height="40px"
                hasError={!!errors.securityCode}
                labelMarginTop="0"
              />

              {errors.securityCode && (
                <ErrorText>{errors.securityCode}</ErrorText>
              )}
            </FieldWrapper>
          </Grid>
        </Container>
      </GenericModal>

      {!isEdit ? (
        <GenericModal
          visible={successOpen}
          icon={<SuccessModalIcon />}
          title={t(
            DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal.successTitle,
          )}
          message={t(
            DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal.successMessage,
          )}
          confirmLabel={t("contents.deleteSuccessModal.done")}
          onCancel={() => setSuccessOpen(false)}
          onConfirm={() => setSuccessOpen(false)}
          showCloseButton={false}
        />
      ) : null}
    </>
  );
}
