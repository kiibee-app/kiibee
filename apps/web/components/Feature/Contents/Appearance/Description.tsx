"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import { INPUT_VARIANTS, maxDescriptionCharacters } from "@/utils/Constants";
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

export default function DescriptionSection() {
  const { t } = useTranslation();

  const [description, setDescription] = useState("");

  const handleChange = (value: string | string[]) => {
    const text = Array.isArray(value) ? value.join("") : value;
    setDescription(text.slice(0, maxDescriptionCharacters));
  };

  return (
    <AppearancePanel>
      <SectionList>
        <Row>
          <Copy>
            <Label>{t(CONTENTS.appearance.description.label)}</Label>
            <Hint>{t(CONTENTS.appearance.description.hint)}</Hint>
          </Copy>

          <ControlWrap>
            <InputField
              type={INPUT_TYPE.TEXTAREA}
              value={description}
              onChange={handleChange}
              placeholder={t(CONTENTS.appearance.description.placeholder)}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </ControlWrap>

          <CounterRow>
            <CounterText>{t(CONTENTS.appearance.maximumCharacter)}</CounterText>
            <CounterText>
              {description.length}/{maxDescriptionCharacters}
            </CounterText>
          </CounterRow>
        </Row>
      </SectionList>
    </AppearancePanel>
  );
}
