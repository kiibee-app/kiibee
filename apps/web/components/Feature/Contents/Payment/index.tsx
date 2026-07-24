"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import TagsInput from "@/components/UI/InputFields/TagsInput";
import { ErrorText } from "@/components/UI/InputFields/styles";
import SortDropdown from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import {
  INPUT_VARIANTS,
  maxDescriptionCharacters,
  SORT_DROPDOWN_VARIANT,
  STRING_EMPTY,
} from "@/utils/Constants";
import {
  PAYMENT_DOWNLOAD_LIMIT_VALUES,
  type PaymentDownloadLimitValue,
} from "@/utils/common";
import {
  Block,
  ControlWrap,
  DropdownWrap,
  FeeNote,
  PaymentCard,
  PaymentForm,
  SectionText,
  SectionTitle,
  HelperFormRow,
  HelperText,
} from "./styles";
import TrailerList from "../General/TrailerList";
import {
  ADMISSION_TYPE,
  AdmissionValue,
  getAdmissionOptions,
  getDownloadLimitOptions,
  getPaymentContentTexts,
  getPaymentAmountErrorMessage,
  hasNegativeAmountInput,
  getPhysicalProductConfig,
  PAYMENTS_FORM_FIELDS,
  toText,
} from "@/utils/paymentRequirements";
import {
  combinePasswords,
  validatePasswordInput,
} from "@/utils/admissionRequirements";
import { useContentForm } from "../ContentFormContext";

export default function Payment() {
  const { t } = useTranslation();
  const { formState, formErrors, updateField, setFieldError, clearFieldError } =
    useContentForm();
  const admissionOptions = useMemo(() => getAdmissionOptions(t), [t]);
  const downloadLimitOptions = useMemo(
    () => getDownloadLimitOptions(t, PAYMENT_DOWNLOAD_LIMIT_VALUES),
    [t],
  );

  const physicalProductConfig = useMemo(() => getPhysicalProductConfig(t), [t]);
  const [typedPassword, setTypedPassword] = useState("");

  const isPayment = formState.admissionRequirement === ADMISSION_TYPE.PAYMENT;

  const isSetPassword =
    formState.admissionRequirement === ADMISSION_TYPE.SET_PASSWORD;

  const effectivePassword = useMemo(
    () => combinePasswords(formState.password, typedPassword),
    [formState.password, typedPassword],
  );

  const passwordHasError =
    validatePasswordInput(effectivePassword) ||
    Boolean(formErrors[PAYMENTS_FORM_FIELDS.PASSWORD]);
  const passwordErrorMessage = validatePasswordInput(effectivePassword)
    ? t("contents.admissionRequirements.password.error.minLength")
    : formErrors[PAYMENTS_FORM_FIELDS.PASSWORD];

  const updatePasswordValidationError = (committed: string, typed: string) => {
    const full = combinePasswords(committed, typed);
    if (validatePasswordInput(full)) {
      setFieldError(
        PAYMENTS_FORM_FIELDS.PASSWORD,
        t("contents.admissionRequirements.password.error.minLength"),
      );
    } else {
      clearFieldError(PAYMENTS_FORM_FIELDS.PASSWORD);
    }
  };

  const paymentTexts = useMemo(
    () => getPaymentContentTexts(t, formState.contentTypeId),
    [t, formState.contentTypeId],
  );

  const showRentalSection = Boolean(
    paymentTexts.rentalTitle && paymentTexts.rentalDescription,
  );

  const showPurchaseSection = Boolean(
    paymentTexts.purchaseTitle && paymentTexts.purchaseDescription,
  );

  const handleNumericChange = (
    field:
      | typeof PAYMENTS_FORM_FIELDS.RENTAL_AMOUNT
      | typeof PAYMENTS_FORM_FIELDS.PURCHASE_AMOUNT,
    value: string | string[],
  ) => {
    const text = toText(value);
    if (hasNegativeAmountInput(text)) return;
    updateField(field, text);
    const errorMessage = getPaymentAmountErrorMessage(text, t);
    if (errorMessage) {
      setFieldError(field, errorMessage);
    } else {
      clearFieldError(field);
    }
  };

  return (
    <>
      <PaymentCard>
        <PaymentForm>
          <Block>
            <SectionTitle>{t("contents.payment.admission.title")}</SectionTitle>
            <SectionText>
              {t("contents.payment.admission.description")}
            </SectionText>

            <DropdownWrap>
              <SortDropdown
                options={admissionOptions}
                value={formState[PAYMENTS_FORM_FIELDS.ADMISSION_REQUIREMENT]}
                onChange={(value) =>
                  updateField(
                    PAYMENTS_FORM_FIELDS.ADMISSION_REQUIREMENT,
                    value as AdmissionValue,
                  )
                }
                variant={SORT_DROPDOWN_VARIANT.SURFACE}
                maxWidth="100%"
              />
            </DropdownWrap>
          </Block>

          {isPayment && (
            <>
              {showRentalSection && (
                <Block>
                  <SectionTitle>{paymentTexts.rentalTitle}</SectionTitle>

                  <SectionText>{paymentTexts.rentalDescription}</SectionText>

                  <ControlWrap>
                    <InputField
                      value={formState.rentalAmount || STRING_EMPTY}
                      onChange={(v) => handleNumericChange("rentalAmount", v)}
                      placeholder={t("contents.payment.common.enterAmount")}
                      variant={INPUT_VARIANTS.PRIMARY_GRAY}
                      inputMode="decimal"
                      min={0}
                      hasError={Boolean(formErrors.rentalAmount)}
                      errorMessage={formErrors.rentalAmount}
                    />
                  </ControlWrap>

                  <FeeNote>{t("contents.payment.common.feeNote")}</FeeNote>
                </Block>
              )}

              {showPurchaseSection && (
                <Block>
                  <SectionTitle>{paymentTexts.purchaseTitle}</SectionTitle>
                  <SectionText>{paymentTexts.purchaseDescription}</SectionText>
                  <ControlWrap>
                    <InputField
                      value={formState.purchaseAmount || STRING_EMPTY}
                      onChange={(v) => handleNumericChange("purchaseAmount", v)}
                      placeholder={t("contents.payment.common.enterAmount")}
                      variant={INPUT_VARIANTS.PRIMARY_GRAY}
                      inputMode="decimal"
                      min={0}
                      hasError={Boolean(formErrors.purchaseAmount)}
                      errorMessage={formErrors.purchaseAmount}
                    />
                  </ControlWrap>

                  <FeeNote>{t("contents.payment.common.feeNote")}</FeeNote>
                </Block>
              )}

              <Block>
                <SectionTitle>
                  {t("contents.payment.downloadLimit.title")}
                </SectionTitle>
                <SectionText>
                  {t("contents.payment.downloadLimit.description")}
                </SectionText>

                <DropdownWrap>
                  <SortDropdown
                    options={downloadLimitOptions}
                    value={formState.maxDownloadLimit}
                    onChange={(value) =>
                      updateField(
                        PAYMENTS_FORM_FIELDS.MAX_DOWNLOAD_LIMIT,
                        String(value) as PaymentDownloadLimitValue,
                      )
                    }
                    variant={SORT_DROPDOWN_VARIANT.SURFACE}
                    maxWidth="100%"
                    renderSelectedLabel={(value, option) => (
                      <MonoText $use="Body_Regular">
                        {option?.label ?? value}
                      </MonoText>
                    )}
                  />
                </DropdownWrap>
              </Block>
            </>
          )}

          {isSetPassword && (
            <ControlWrap>
              <TagsInput
                value={formState.password}
                onChange={(v) => {
                  const text = toText(v).slice(0, maxDescriptionCharacters);
                  updateField(PAYMENTS_FORM_FIELDS.PASSWORD, text);
                  updatePasswordValidationError(text, typedPassword);
                }}
                onInputChange={(typed) => {
                  setTypedPassword(typed);
                  updatePasswordValidationError(formState.password, typed);
                }}
                placeholder={t("contents.payment.password.placeholder")}
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                hasError={passwordHasError}
                separateOnSpace={true}
              />

              {passwordHasError && passwordErrorMessage && (
                <ErrorText>{passwordErrorMessage}</ErrorText>
              )}

              <HelperFormRow>
                <HelperText>{t("contents.payment.password.helper")}</HelperText>
                <HelperText>
                  {formState.password.length}/{maxDescriptionCharacters}
                </HelperText>
              </HelperFormRow>
            </ControlWrap>
          )}
        </PaymentForm>
      </PaymentCard>

      <TrailerList config={physicalProductConfig} />
    </>
  );
}
