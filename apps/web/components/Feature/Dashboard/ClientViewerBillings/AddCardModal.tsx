"use client";

import React from "react";
import { GenericModal } from "@/components/UI/Modals";
import InputField from "@/components/UI/InputFields";
import { INPUT_TYPE, MODAL_ALIGN } from "@/utils/ui";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { CardIcon, SuccessArcIcon } from "@/assets/icons";
import { useAddCard } from "@/hooks/useAddCard";
import { Container, ErrorText, FieldWrapper, Grid } from "./styles";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import { useTranslation } from "react-i18next";
import COLORS from "@repo/ui/colors";

type AddCardModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AddCardModal({ visible, onClose }: AddCardModalProps) {
  const { t } = useTranslation();

  const {
    cardNumber,
    expiryDate,
    securityCode,
    errors,
    successOpen,
    setSuccessOpen,
    handleSubmit,
    handleClose,
    handleCardNumberChange,
    handleExpiryChange,
    handleCVVChange,
  } = useAddCard(onClose);

  const isFormValid =
    cardNumber.trim().length > 0 &&
    expiryDate.trim().length > 0 &&
    securityCode.trim().length > 0;

  return (
    <>
      <GenericModal
        visible={visible}
        title={t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal.title)}
        cancelLabel={t("common.cancel")}
        confirmLabel={t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCard)}
        onCancel={handleClose}
        onClose={handleClose}
        onConfirm={handleSubmit}
        width="630px"
        padding="30px"
        buttonRow
        buttonAlign={MODAL_ALIGN.END}
        textAlign={MODAL_ALIGN.START}
        confirmDisabled={!isFormValid}
      >
        <Container>
          <FieldWrapper>
            <InputField
              label={t(
                DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal
                  .cardNumber,
              )}
              type={INPUT_TYPE.TEXT}
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder={t(
                DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal
                  .cardPlaceholder,
              )}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              height="40px"
              hasError={!!errors.cardNumber}
              icon={<CardIcon width={20} height={20} />}
            />

            {errors.cardNumber && <ErrorText>{errors.cardNumber}</ErrorText>}
          </FieldWrapper>

          <Grid>
            <FieldWrapper>
              <InputField
                label={t(
                  DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal
                    .expiryDate,
                )}
                type={INPUT_TYPE.TEXT}
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder={t(
                  DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal
                    .expiryPlaceholder,
                )}
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                height="40px"
                hasError={!!errors.expiryDate}
              />

              {errors.expiryDate && <ErrorText>{errors.expiryDate}</ErrorText>}
            </FieldWrapper>

            <FieldWrapper>
              <InputField
                label={t(
                  DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal.cvv,
                )}
                type={INPUT_TYPE.TEXT}
                value={securityCode}
                onChange={handleCVVChange}
                placeholder={t(
                  DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCardModal
                    .cvvPlaceholder,
                )}
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                height="40px"
                hasError={!!errors.securityCode}
              />

              {errors.securityCode && (
                <ErrorText>{errors.securityCode}</ErrorText>
              )}
            </FieldWrapper>
          </Grid>
        </Container>
      </GenericModal>

      <GenericModal
        visible={successOpen}
        icon={
          <SuccessArcIcon
            width={40}
            height={40}
            color={COLORS.primary.GREEN_200}
          />
        }
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
    </>
  );
}
