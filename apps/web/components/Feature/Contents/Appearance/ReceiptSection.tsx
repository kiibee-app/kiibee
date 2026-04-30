"use client";

import React, { useCallback, useState } from "react";
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
import { INPUT_TYPE } from "@/utils/ui";

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

  const receiptLength = form.receiptMessage.length;

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

  return (
    <AppearancePanel>
      <SectionList>
        <Row>
          <Copy>
            <Label>{t(CONTENTS.appearance.receipt)}</Label>
            <Hint>{t(CONTENTS.appearance.receiptHint)}</Hint>
          </Copy>

          <ControlWrap>
            <InputField
              type={INPUT_TYPE.TEXTAREA}
              value={form.receiptMessage}
              onChange={handleChange("receiptMessage", maxReceiptCharacters)}
              placeholder={t(CONTENTS.appearance.receiptPlaceholder)}
              width="100%"
              height="46px"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </ControlWrap>

          <CounterRow>
            <CounterText>{t(CONTENTS.appearance.maximumCharacter)}</CounterText>
            <CounterText>
              {receiptLength}/{maxReceiptCharacters}
            </CounterText>
          </CounterRow>
        </Row>

        <Row>
          <Copy>
            <Label>{t(CONTENTS.appearance.supportEmail)}</Label>
            <Hint>{t(CONTENTS.appearance.supportEmailHint)}</Hint>
          </Copy>

          <ControlWrap>
            <InputField
              type={INPUT_TYPE.EMAIL}
              value={form.supportEmail}
              onChange={handleChange("supportEmail")}
              placeholder={t(CONTENTS.appearance.supportEmailPlaceholder)}
              width="100%"
              height="46px"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </ControlWrap>
        </Row>
      </SectionList>
    </AppearancePanel>
  );
}
