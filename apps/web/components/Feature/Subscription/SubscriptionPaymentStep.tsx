"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import COLORS from "@repo/ui/colors";
import { CardIcon } from "@/assets/icons";
import masterCardLogo from "@/assets/icons/masterCard.svg";
import mobilePayLogo from "@/assets/icons/mobilepay.svg";
import visaLogo from "@/assets/icons/visa.svg";
import Image from "@/components/UI/SafeImage";
import FormField from "@/components/UI/FormField";
import SortDropdown from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_TYPE } from "@/utils/ui";
import { INPUT_VARIANTS } from "@/utils/Constants";
import {
  isFreeSubscriptionPlan,
  subscriptionPlans,
} from "@/utils/subscriptionPlans";
import {
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_METHODS,
  PaymentMethod,
} from "@/utils/creatorFinalSteps";
import { useSubscriptionContext } from "@/providers/subscriptionProvider";
import { createPaymentSchema } from "@/lib/validation/schema";
import { formatCardNumber, formatCVV, formatExpiryDate } from "@/utils/addCard";
import { NUMERIC_INPUT_MODE } from "@/utils/numericFields";
import {
  Fields,
  Form,
  InlineFields,
  PaymentCard,
  PaymentCardLogoWrap,
  PaymentMethodButton,
  PaymentMethods,
  PaymentMobileLogoWrap,
  PaymentTitle,
  PlanSelectWrap,
  RadioDot,
  SubmitButton,
} from "./SubscriptionPaymentStep.styles";

export default function SubscriptionPaymentStep() {
  const { t } = useTranslation();
  const {
    selectedPlan,
    onSelectPlan,
    getPlanPriceLabel,
    isCreatorInviteFlow,
    completeCreatorInviteSignup,
    isInviteSubmitting,
  } = useSubscriptionContext();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    DEFAULT_PAYMENT_METHOD,
  );

  const isFreePlan = selectedPlan
    ? isFreeSubscriptionPlan(selectedPlan)
    : false;
  const schema = useMemo(
    () =>
      createPaymentSchema({
        cardNumberRequired: t("creatorFinalSteps.fields.cardNumber"),
        cardholderNameRequired: t("creatorFinalSteps.fields.cardholderName"),
        expiryDateRequired: t("creatorFinalSteps.fields.expiryDate"),
        cvcRequired: t("creatorFinalSteps.fields.cvc"),
      }),
    [t],
  );
  type PaymentFormValues = ReturnType<typeof schema.parse>;
  const methods = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvc: "",
    },
  });
  const {
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  const planOptions = useMemo(
    () =>
      subscriptionPlans.map((plan) => ({
        value: plan.id,
        label: t(plan.nameKey),
      })),
    [t],
  );

  const updateField = (
    field: keyof PaymentFormValues,
    value: string | string[],
  ) => {
    const raw = Array.isArray(value) ? value.join(" ") : value;
    const normalized =
      field === "cardNumber"
        ? formatCardNumber(raw)
        : field === "expiryDate"
          ? formatExpiryDate(raw)
          : field === "cvc"
            ? formatCVV(raw)
            : raw;
    setValue(field, normalized as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async () => {
    if (isCreatorInviteFlow) {
      await completeCreatorInviteSignup();
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFreePlan) {
      onSubmit();
      return;
    }

    handleSubmit(onSubmit)(e);
  };

  return (
    <PaymentCard>
      <PaymentTitle>
        <MonoText $use="H4_Medium">{t("creatorFinalSteps.title")}</MonoText>
      </PaymentTitle>

      <FormProvider {...methods}>
        <Form onSubmit={handleFormSubmit}>
          <PlanSelectWrap>
            <SortDropdown
              options={planOptions}
              value={selectedPlan}
              onChange={onSelectPlan}
              renderSelectedLabel={(_, option) =>
                option
                  ? `${option.label} (${getPlanPriceLabel(option.value)})`
                  : ""
              }
              renderOptionLabel={(option) => (
                <span>
                  {option.label} ({getPlanPriceLabel(option.value)})
                </span>
              )}
              width="100%"
              maxWidth="100%"
              variant="success"
            />
          </PlanSelectWrap>

          {!isFreePlan && (
            <>
              <PaymentMethods
                role="group"
                aria-label={t("creatorFinalSteps.fields.payment")}
              >
                <PaymentMethodButton
                  type="button"
                  $active={paymentMethod === PAYMENT_METHODS.CARD}
                  aria-pressed={paymentMethod === PAYMENT_METHODS.CARD}
                  aria-label={t("creatorFinalSteps.payment.card")}
                  onClick={() => setPaymentMethod(PAYMENT_METHODS.CARD)}
                >
                  <PaymentCardLogoWrap>
                    <Image
                      src={visaLogo}
                      alt="Visa credit card"
                      width={31}
                      height={10}
                    />
                    <Image
                      src={masterCardLogo}
                      alt="Mastercard credit card"
                      width={21}
                      height={16}
                    />
                  </PaymentCardLogoWrap>
                  <RadioDot $active={paymentMethod === PAYMENT_METHODS.CARD} />
                </PaymentMethodButton>

                <PaymentMethodButton
                  type="button"
                  $active={paymentMethod === PAYMENT_METHODS.MOBILEPAY}
                  aria-pressed={paymentMethod === PAYMENT_METHODS.MOBILEPAY}
                  aria-label={t("creatorFinalSteps.payment.mobilePay")}
                  onClick={() => setPaymentMethod(PAYMENT_METHODS.MOBILEPAY)}
                >
                  <PaymentMobileLogoWrap>
                    <Image
                      src={mobilePayLogo}
                      alt="MobilePay"
                      width={50}
                      height={16}
                    />
                  </PaymentMobileLogoWrap>
                  <RadioDot
                    $active={paymentMethod === PAYMENT_METHODS.MOBILEPAY}
                  />
                </PaymentMethodButton>
              </PaymentMethods>

              <Fields>
                <FormField<PaymentFormValues>
                  id="creator-card-number"
                  name="cardNumber"
                  label={t("creatorFinalSteps.fields.cardNumber")}
                  placeholder={t("creatorFinalSteps.fields.cardNumber")}
                  labelFontStyle="Body_Regular"
                  labelMarginTop="0"
                  type={INPUT_TYPE.TEXT}
                  inputMode={NUMERIC_INPUT_MODE}
                  autoComplete="cc-number"
                  onChange={(value) => updateField("cardNumber", value)}
                  variant={INPUT_VARIANTS.PRIMARY_GRAY}
                  height="38px"
                  icon={
                    <CardIcon
                      width={18}
                      height={18}
                      color={COLORS.primary.BLACK}
                    />
                  }
                />

                <FormField<PaymentFormValues>
                  id="creator-cardholder-name"
                  name="cardholderName"
                  label={t("creatorFinalSteps.fields.cardholderName")}
                  placeholder={t("creatorFinalSteps.fields.cardholderName")}
                  labelFontStyle="Body_Regular"
                  labelMarginTop="0"
                  type={INPUT_TYPE.TEXT}
                  autoComplete="cc-name"
                  onChange={(value) => updateField("cardholderName", value)}
                  variant={INPUT_VARIANTS.PRIMARY_GRAY}
                  height="38px"
                />

                <InlineFields>
                  <FormField<PaymentFormValues>
                    id="creator-card-expiry"
                    name="expiryDate"
                    label={t("creatorFinalSteps.fields.expiryDate")}
                    labelFontStyle="Body_Regular"
                    labelMarginTop="0"
                    type={INPUT_TYPE.TEXT}
                    inputMode={NUMERIC_INPUT_MODE}
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    onChange={(value) => updateField("expiryDate", value)}
                    variant={INPUT_VARIANTS.PRIMARY_GRAY}
                    height="38px"
                  />

                  <FormField<PaymentFormValues>
                    id="creator-card-cvc"
                    name="cvc"
                    label={t("creatorFinalSteps.fields.cvc")}
                    placeholder={t("creatorFinalSteps.fields.cvc")}
                    labelFontStyle="Body_Regular"
                    labelMarginTop="0"
                    type={INPUT_TYPE.TEXT}
                    inputMode={NUMERIC_INPUT_MODE}
                    autoComplete="cc-csc"
                    onChange={(value) => updateField("cvc", value)}
                    variant={INPUT_VARIANTS.PRIMARY_GRAY}
                    height="38px"
                  />
                </InlineFields>
              </Fields>
            </>
          )}

          <SubmitButton
            type="submit"
            disabled={
              (!isFreePlan && !isValid) ||
              (isCreatorInviteFlow && isInviteSubmitting)
            }
            isLoading={isCreatorInviteFlow && isInviteSubmitting}
          >
            {t("creatorFinalSteps.submit")}
          </SubmitButton>
        </Form>
      </FormProvider>
    </PaymentCard>
  );
}
