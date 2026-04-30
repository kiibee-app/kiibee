"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import { INPUT_VARIANTS, maxReceiptCharacters } from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";
import { AppearancePanel } from "../styles";
import {
  ControlWrap,
  Copy,
  CounterRow,
  CounterText,
  Hint,
  Label,
  Row,
  SectionList,
} from "./styles";
import { getReceiptFields } from "@/utils/appearance";

type FormState = {
  receiptMessage: string;
  supportEmail: string;
};

export default function ReceiptSection() {
  const { t } = useTranslation();

  const [form, setForm] = useState<FormState>({
    receiptMessage: "",
    supportEmail: "",
  });

  const normalizeValue = (value: string | string[]) =>
    Array.isArray(value) ? value.join("") : value;

  const handleChange = useCallback(
    (key: keyof FormState, limit?: number) => (value: string | string[]) => {
      const nextValue = normalizeValue(value);

      setForm((prev) => ({
        ...prev,
        [key]: limit ? nextValue.slice(0, limit) : nextValue,
      }));
    },
    [],
  );

  const fields = useMemo(
    () =>
      getReceiptFields({
        receiptMessage: form.receiptMessage,
        supportEmail: form.supportEmail,
      }),
    [form],
  );

  return (
    <AppearancePanel>
      <SectionList>
        {fields.map((field) => (
          <Row key={field.key}>
            <Copy>
              <Label>{t(field.label)}</Label>
              <Hint>{t(field.hint)}</Hint>
            </Copy>

            <ControlWrap>
              <InputField
                type={field.type}
                value={field.value}
                onChange={handleChange(field.key, field.limit)}
                placeholder={t(field.placeholder)}
                width="100%"
                height="46px"
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
              />
            </ControlWrap>

            {field.showCounter && (
              <CounterRow>
                <CounterText>
                  {t(CONTENTS.appearance.maximumCharacter)}
                </CounterText>
                <CounterText>
                  {form.receiptMessage.length}/{maxReceiptCharacters}
                </CounterText>
              </CounterRow>
            )}
          </Row>
        ))}
      </SectionList>
    </AppearancePanel>
  );
}
