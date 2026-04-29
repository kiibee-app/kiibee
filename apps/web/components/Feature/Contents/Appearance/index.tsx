"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import {
  APPEARANCE_DEFAULT_HEX_COLOR,
  INPUT_VARIANTS,
} from "@/utils/Constants";
import SortDropdown from "@/components/UI/SortDropdown";
import { AppearancePanel } from "../styles";

import {
  ControlWrap,
  Copy,
  Hint,
  InlineControlWrap,
  InlineRow,
  Label,
  Row,
  SectionList,
  Swatch,
} from "./styles";

export default function AppearanceContent() {
  const { t } = useTranslation();
  const [hexColor, setHexColor] = useState(APPEARANCE_DEFAULT_HEX_COLOR);
  const [textColor, setTextColor] = useState("follow-theme");
  const [buttonColor, setButtonColor] = useState("choose-color");

  const textColorOptions = [
    { value: "follow-theme", label: t("contents.appearance.followTheme") },
  ];

  const buttonColorOptions = [
    { value: "choose-color", label: t("contents.appearance.chooseColor") },
  ];

  return (
    <AppearancePanel>
      <SectionList>
        <Row>
          <Copy>
            <Label>{t("contents.appearance.textColor")}</Label>
            <Hint>{t("contents.appearance.textColorHint")}</Hint>
          </Copy>
          <ControlWrap>
            <SortDropdown
              options={textColorOptions}
              value={textColor}
              onChange={setTextColor}
              width="100%"
              maxWidth="100%"
              variant="surface"
            />
          </ControlWrap>
        </Row>

        <Row>
          <Copy>
            <Label>{t("contents.appearance.buttonColor")}</Label>
            <Hint>{t("contents.appearance.buttonColorHint")}</Hint>
          </Copy>
          <ControlWrap>
            <SortDropdown
              options={buttonColorOptions}
              value={buttonColor}
              onChange={setButtonColor}
              width="100%"
              maxWidth="100%"
              variant="surface"
            />
          </ControlWrap>
        </Row>

        <InlineRow>
          <Copy>
            <Label>{t("contents.appearance.color")}</Label>
          </Copy>
          <InlineControlWrap>
            <InputField
              type="text"
              value={hexColor}
              onChange={(value) => setHexColor(value as string)}
              width="100%"
              height="46px"
              icon={<Swatch $color={hexColor} />}
              variant={INPUT_VARIANTS.SURFACE}
            />
          </InlineControlWrap>
        </InlineRow>
      </SectionList>
    </AppearancePanel>
  );
}
