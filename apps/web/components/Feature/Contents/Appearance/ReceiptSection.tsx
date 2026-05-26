"use client";

import React, { useCallback, useMemo } from "react";
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
import { useAppearanceForm } from "./AppearanceFormContext";

export default function ReceiptSection() {
  const { t } = useTranslation();
  const { values, updateField } = useAppearanceForm();

  const normalizeValue = (value: string | string[]) =>
    Array.isArray(value) ? value.join("") : value;

  const handleChange = useCallback(
    (key: "receipt" | "supportEmail", limit?: number) =>
      (value: string | string[]) => {
        const nextValue = normalizeValue(value);
        updateField(key, limit ? nextValue.slice(0, limit) : nextValue);
      },
    [updateField],
  );

  const fields = useMemo(
    () =>
      getReceiptFields({
        receiptMessage: values.receipt,
        supportEmail: values.supportEmail,
      }),
    [values.receipt, values.supportEmail],
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
                onChange={handleChange(
                  field.key === "receiptMessage" ? "receipt" : "supportEmail",
                  field.limit,
                )}
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
                  {values.receipt.length}/{maxReceiptCharacters}
                </CounterText>
              </CounterRow>
            )}
          </Row>
        ))}
      </SectionList>
    </AppearancePanel>
  );
}
