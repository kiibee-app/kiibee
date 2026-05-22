"use client";

import React from "react";
import InputField from "@/components/UI/InputFields";
import { Card, Fields, Title, TwoColumnRow } from "./styles";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { PaymentKeys } from "@/utils/creatorProfile";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { getPaymentFields } from "@/utils/creatorProfilefields";
import { NUMERIC_INPUT_MODE, sanitizeDigits } from "@/utils/numericFields";

type PaymentProps = {
  form: Record<string, string>;
  onChange: (key: PaymentKeys) => (value: string | string[]) => void;
  t: (key: string) => string;
};

export default function PaymentSection({ form, onChange, t }: PaymentProps) {
  const fields = getPaymentFields(t);

  const handlePaymentChange =
    (key: PaymentKeys) => (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : value;
      onChange(key)(sanitizeDigits(text));
    };

  return (
    <Card>
      <Title>
        <MonoText $use="Body_SemiBold">
          {t(CREATOR_PROFILE.paymentTitle)}
        </MonoText>
      </Title>

      <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
        {t(CREATOR_PROFILE.paymentText)}
      </MonoText>

      <Fields>
        <TwoColumnRow>
          {fields.map((field) => (
            <InputField
              key={field.key}
              label={field.label}
              value={form[field.key]}
              onChange={handlePaymentChange(field.key as PaymentKeys)}
              inputMode={NUMERIC_INPUT_MODE}
              labelFontStyle="Body_Regular"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          ))}
        </TwoColumnRow>
      </Fields>
    </Card>
  );
}
