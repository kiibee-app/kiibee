"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import InputField from "@/components/UI/InputFields";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { INPUT_TYPE, MODAL_ALIGN } from "@/utils/ui";
import { NUMERIC_INPUT_MODE, sanitizeDigits } from "@/utils/numericFields";
import {
  type ViewerPaymentMethod,
  CARD_BRAND_LOGOS,
} from "@/utils/dummyData/viewerBillingMockData";
import { CARD_BRANDS } from "@/utils/Constants";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import SafeImage from "@/components/UI/SafeImage";
import { CardIconBox, Container, FieldWrapper, Grid } from "./styles";

type EditCardModalProps = {
  visible: boolean;
  paymentMethod: ViewerPaymentMethod;
  onClose: () => void;
  onSave: (updatedMethod: ViewerPaymentMethod) => void;
};

export default function EditCardModal({
  visible,
  paymentMethod,
  onClose,
  onSave,
}: EditCardModalProps) {
  const { t } = useTranslation();
  const initialCardNumber = paymentMethod.cardNumber;
  const initialExpiryDate = paymentMethod.expiresAt;
  const initialSecurityCode = paymentMethod.securityCode ?? "";

  const [cardNumber, setCardNumber] = useState(initialCardNumber);
  const [expiryDate, setExpiryDate] = useState(initialExpiryDate);
  const [securityCode, setSecurityCode] = useState(initialSecurityCode);

  const isFormValid =
    cardNumber.trim().length > 0 &&
    expiryDate.trim().length > 0 &&
    securityCode.trim().length > 0;

  const handleSave = () => {
    const last4 = sanitizeDigits(cardNumber).slice(-4);
    const brandLabel =
      paymentMethod.brand.charAt(0).toUpperCase() +
      paymentMethod.brand.slice(1).toLowerCase();

    onSave({
      ...paymentMethod,
      cardNumber,
      expiresAt: expiryDate,
      securityCode,
      label: `${brandLabel} **** ${last4}`,
    });
  };

  return (
    <GenericModal
      visible={visible}
      title={t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.editCardModal.title)}
      cancelLabel={t("common.cancel")}
      confirmLabel={t("common.save")}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={handleSave}
      size="md"
      spacing="start"
      buttonRow
      buttonAlign={MODAL_ALIGN.END}
      textAlign={MODAL_ALIGN.START}
      contentMarginBottom="30px"
      confirmDisabled={!isFormValid}
    >
      <Container>
        <FieldWrapper>
          <InputField
            label={t(
              DASHBOARD_VIEWER_BILLINGS.paymentMethods.editCardModal.cardNumber,
            )}
            type={INPUT_TYPE.TEXT}
            inputMode={NUMERIC_INPUT_MODE}
            value={cardNumber}
            onChange={(value) => setCardNumber(String(value))}
            placeholder={t(
              DASHBOARD_VIEWER_BILLINGS.paymentMethods.editCardModal
                .cardPlaceholder,
            )}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            height="40px"
            icon={
              <CardIconBox>
                <SafeImage
                  src={CARD_BRAND_LOGOS[paymentMethod.brand]}
                  alt={paymentMethod.brand}
                  width={paymentMethod.brand === CARD_BRANDS.VISA ? 26 : 20}
                  height={paymentMethod.brand === CARD_BRANDS.VISA ? 8 : 14}
                />
              </CardIconBox>
            }
            labelMarginTop="0"
          />
        </FieldWrapper>

        <Grid>
          <FieldWrapper>
            <InputField
              label={t(
                DASHBOARD_VIEWER_BILLINGS.paymentMethods.editCardModal
                  .expiryDate,
              )}
              type={INPUT_TYPE.TEXT}
              inputMode={NUMERIC_INPUT_MODE}
              value={expiryDate}
              onChange={(value) => setExpiryDate(String(value))}
              placeholder={t(
                DASHBOARD_VIEWER_BILLINGS.paymentMethods.editCardModal
                  .expiryPlaceholder,
              )}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              height="40px"
              labelMarginTop="0"
            />
          </FieldWrapper>

          <FieldWrapper>
            <InputField
              label={t(
                DASHBOARD_VIEWER_BILLINGS.paymentMethods.editCardModal.cvv,
              )}
              type={INPUT_TYPE.TEXT}
              inputMode={NUMERIC_INPUT_MODE}
              value={securityCode}
              onChange={(value) => setSecurityCode(String(value))}
              placeholder={t(
                DASHBOARD_VIEWER_BILLINGS.paymentMethods.editCardModal
                  .cvvPlaceholder,
              )}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              height="40px"
              labelMarginTop="0"
            />
          </FieldWrapper>
        </Grid>
      </Container>
    </GenericModal>
  );
}
