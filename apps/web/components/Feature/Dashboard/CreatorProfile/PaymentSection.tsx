"use client";

import React from "react";
import InputField from "@/components/UI/InputFields";
import {
  Card,
  Fields,
  PaymentText,
  SectionTitle,
  TwoColumnRow,
} from "./styles";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { PaymentKeys } from "@/utils/creatorProfile";
import { INPUT_VARIANTS } from "@/utils/Constants";

type PaymentProps = {
  form: {
    reg: string;
    account: string;
  };
  onChange: (key: PaymentKeys) => (value: string | string[]) => void;
  t: (key: string) => string;
};

export default function PaymentSection({ form, onChange, t }: PaymentProps) {
  return (
    <Card>
      <SectionTitle>{t(CREATOR_PROFILE.paymentTitle)}</SectionTitle>
      <PaymentText>{t(CREATOR_PROFILE.paymentText)}</PaymentText>

      <Fields>
        <TwoColumnRow>
          <InputField
            label={t(CREATOR_PROFILE.regLabel)}
            value={form.reg}
            onChange={onChange("reg")}
            labelFontStyle="Body_Regular"
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
          />

          <InputField
            label={t(CREATOR_PROFILE.accountLabel)}
            value={form.account}
            onChange={onChange("account")}
            labelFontStyle="Body_Regular"
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
          />
        </TwoColumnRow>
      </Fields>
    </Card>
  );
}
