"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import COLORS from "@repo/ui/colors";
import { CardIcon } from "@/assets/icons";
import masterCardLogo from "@/assets/icons/masterCard.svg";
import mobilePayLogo from "@/assets/icons/mobilepay.svg";
import visaLogo from "@/assets/icons/visa.svg";
import Image from "@/components/UI/SafeImage";
import InputField from "@/components/UI/InputFields";
import SortDropdown from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_TYPE } from "@/utils/ui";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import {
  FORM_FIELDS,
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_METHODS,
  PaymentMethod,
} from "@/utils/creatorFinalSteps";
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

type FormValues = {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvc: string;
};

const INITIAL_FORM_VALUES: FormValues = {
  cardNumber: "",
  cardholderName: "",
  expiryDate: "",
  cvc: "",
};

type SubscriptionPaymentStepProps = {
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
  getPlanPriceLabel: (planId: string) => string;
};

export default function SubscriptionPaymentStep({
  selectedPlan,
  onSelectPlan,
  getPlanPriceLabel,
}: SubscriptionPaymentStepProps) {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    DEFAULT_PAYMENT_METHOD,
  );
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES);

  const planOptions = useMemo(
    () =>
      subscriptionPlans.map((plan) => ({
        value: plan.id,
        label: t(plan.nameKey),
      })),
    [t],
  );

  const isSubmitEnabled = Object.values(formValues).every((value) =>
    Boolean(value.trim()),
  );

  const updateField = (field: keyof FormValues, value: string | string[]) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: Array.isArray(value) ? value.join(" ") : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <PaymentCard>
      <PaymentTitle>
        <MonoText $use="H4_Medium">{t("creatorFinalSteps.title")}</MonoText>
      </PaymentTitle>

      <Form onSubmit={handleSubmit}>
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
            maxWidth="312px"
            variant="success"
          />
        </PlanSelectWrap>

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
              <Image src={visaLogo} alt="" width={31} height={10} />
              <Image src={masterCardLogo} alt="" width={21} height={16} />
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
              <Image src={mobilePayLogo} alt="" width={50} height={16} />
            </PaymentMobileLogoWrap>
            <RadioDot $active={paymentMethod === PAYMENT_METHODS.MOBILEPAY} />
          </PaymentMethodButton>
        </PaymentMethods>

        <Fields>
          <InputField
            id="creator-card-number"
            label={t("creatorFinalSteps.fields.cardNumber")}
            placeholder={t("creatorFinalSteps.fields.cardNumber")}
            labelFontStyle="Body_Regular"
            labelMarginTop="0"
            type={INPUT_TYPE.TEXT}
            inputMode="numeric"
            autoComplete="cc-number"
            value={formValues.cardNumber}
            onChange={(value) => updateField(FORM_FIELDS.CARD_NUMBER, value)}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            height="38px"
            icon={
              <CardIcon width={18} height={18} color={COLORS.primary.BLACK} />
            }
          />

          <InputField
            id="creator-cardholder-name"
            label={t("creatorFinalSteps.fields.cardholderName")}
            placeholder={t("creatorFinalSteps.fields.cardholderName")}
            labelFontStyle="Body_Regular"
            labelMarginTop="0"
            type={INPUT_TYPE.TEXT}
            autoComplete="cc-name"
            value={formValues.cardholderName}
            onChange={(value) =>
              updateField(FORM_FIELDS.CARDHOLDER_NAME, value)
            }
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            height="38px"
          />

          <InlineFields>
            <InputField
              id="creator-card-expiry"
              label={t("creatorFinalSteps.fields.expiryDate")}
              labelFontStyle="Body_Regular"
              labelMarginTop="0"
              type={INPUT_TYPE.TEXT}
              inputMode="numeric"
              autoComplete="cc-exp"
              value={formValues.expiryDate}
              placeholder="MM/YY"
              onChange={(value) => updateField(FORM_FIELDS.EXPIRY_DATE, value)}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              height="38px"
            />

            <InputField
              id="creator-card-cvc"
              label={t("creatorFinalSteps.fields.cvc")}
              placeholder={t("creatorFinalSteps.fields.cvc")}
              labelFontStyle="Body_Regular"
              labelMarginTop="0"
              type={INPUT_TYPE.TEXT}
              inputMode="numeric"
              autoComplete="cc-csc"
              value={formValues.cvc}
              onChange={(value) => updateField(FORM_FIELDS.CVC, value)}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              height="38px"
            />
          </InlineFields>
        </Fields>

        <SubmitButton type="submit" disabled={!isSubmitEnabled}>
          {t("creatorFinalSteps.submit")}
        </SubmitButton>
      </Form>
    </PaymentCard>
  );
}
