"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FORMAT_TYPE } from "@/utils/types";
import InputField from "@/components/UI/InputFields";
import TagsInput from "@/components/UI/InputFields/TagsInput";
import {
  ErrorText,
  RequiredIndicator,
} from "@/components/UI/InputFields/styles";
import SortDropdown from "@/components/UI/SortDropdown";
import {
  INPUT_VARIANTS,
  maxDescriptionCharacters,
  SORT_DROPDOWN_VARIANT,
  STRING_EMPTY,
} from "@/utils/Constants";
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

interface PaymentProps {
  contentType?: string;
}

export default function Payment({ contentType }: PaymentProps = {}) {
  const { t } = useTranslation();
  const { formState, formErrors, updateField, setFieldError, clearFieldError } =
    useContentForm();
  const { contentTypeId, admissionRequirement } = formState;

  const admissionOptions = useMemo(
    () => getAdmissionOptions(t, contentTypeId),
    [t, contentTypeId],
  );

  useEffect(() => {
    const isWeb = contentTypeId === FORMAT_TYPE.WEB;

    const shouldResetAdmission = isWeb
      ? admissionRequirement === ADMISSION_TYPE.PAYMENT
      : admissionRequirement === ADMISSION_TYPE.SET_PASSWORD ||
        admissionRequirement === ADMISSION_TYPE.REQUEST_EMAIL;

    if (shouldResetAdmission) {
      updateField(
        PAYMENTS_FORM_FIELDS.ADMISSION_REQUIREMENT,
        ADMISSION_TYPE.FREE,
      );
    }
  }, [contentTypeId, admissionRequirement, updateField]);

  const physicalProductConfig = useMemo(() => getPhysicalProductConfig(t), [t]);
  const [typedPassword, setTypedPassword] = useState("");

  const isPayment = admissionRequirement === ADMISSION_TYPE.PAYMENT;

  const isSetPassword = admissionRequirement === ADMISSION_TYPE.SET_PASSWORD;

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
    const hasError = validatePasswordInput(full);

    if (!hasError) {
      clearFieldError(PAYMENTS_FORM_FIELDS.PASSWORD);
      return;
    }

    setFieldError(
      PAYMENTS_FORM_FIELDS.PASSWORD,
      t("contents.admissionRequirements.password.error.minLength"),
    );
  };

  const paymentTexts = useMemo(
    () => getPaymentContentTexts(t, contentTypeId),
    [t, contentTypeId],
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

  const handlePasswordChange = (v: string | string[]) => {
    const text = toText(v).slice(0, maxDescriptionCharacters);
    updateField(PAYMENTS_FORM_FIELDS.PASSWORD, text);
    updatePasswordValidationError(text, typedPassword);
  };

  const handleTypedPasswordChange = (typed: string) => {
    setTypedPassword(typed);
    updatePasswordValidationError(formState.password, typed);
  };

  return (
    <>
      <PaymentCard>
        <PaymentForm>
          <Block>
            <SectionTitle>
              {t("contents.payment.admission.title")}
              <RequiredIndicator>*</RequiredIndicator>
            </SectionTitle>
            <SectionText>
              {t("contents.payment.admission.description", {
                contentType:
                  contentType ||
                  t("contents.payment.admission.fallbackContentType"),
              })}
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
                expandLayoutOnOpen={false}
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
            </>
          )}

          {isSetPassword && (
            <ControlWrap>
              {formState.hasPassword &&
              !formState.password &&
              !typedPassword ? (
                <TagsInput
                  value={Array(formState.passwordCount || 1)
                    .fill("••••••")
                    .join(", ")}
                  onInputChange={handleTypedPasswordChange}
                  placeholder={t("contents.payment.password.placeholder")}
                  variant={INPUT_VARIANTS.PRIMARY_GRAY}
                  hasError={false}
                  separateOnSpace={true}
                />
              ) : (
                <TagsInput
                  value={formState.password}
                  onChange={handlePasswordChange}
                  onInputChange={handleTypedPasswordChange}
                  placeholder={t("contents.payment.password.placeholder")}
                  variant={INPUT_VARIANTS.PRIMARY_GRAY}
                  hasError={passwordHasError}
                  separateOnSpace={true}
                />
              )}

              {(!formState.hasPassword ||
                formState.password ||
                typedPassword) &&
                passwordHasError &&
                passwordErrorMessage && (
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
