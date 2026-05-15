"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import {
  APPEARANCE_DEFAULT_HEX_COLOR,
  INPUT_VARIANTS,
} from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";
import { AppearancePanel } from "../styles";
import {
  Copy,
  Hint,
  InlineControlWrap,
  InlineRow,
  Label,
  Row,
  SectionList,
  Swatch,
} from "./styles";
import { INPUT_TYPE } from "@/utils/ui";
import { FieldBox } from "../../Settings/Notification/styles";
import {
  BUTTON_COLOR_VALUES,
  TEXT_COLOR_VALUES,
  getButtonColorOptions,
  getTextColorOptions,
  normalizeHexColor,
} from "@/utils/appearance";
import AppearanceColorPickerModal from "../../../UI/Modals/ColorPickerModal";

export default function AppearanceSettingsSection() {
  const { t } = useTranslation();
  const [hexColor, setHexColor] = useState(APPEARANCE_DEFAULT_HEX_COLOR);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [textColor, setTextColor] = useState<string>(
    TEXT_COLOR_VALUES.FOLLOW_THEME,
  );
  const [buttonColor, setButtonColor] = useState<string>(
    BUTTON_COLOR_VALUES.DEFAULT,
  );
  const textColorOptions = useMemo(() => getTextColorOptions(t), [t]);
  const buttonColorOptions = useMemo(() => getButtonColorOptions(t), [t]);

  const handleHexChange = useCallback((value: string | string[]) => {
    setHexColor(String(value));
  }, []);

  const handleHexBlur = useCallback(() => {
    setHexColor((prev) =>
      normalizeHexColor(prev, APPEARANCE_DEFAULT_HEX_COLOR),
    );
  }, []);

  const handleColorPicked = useCallback((hex: string) => {
    setHexColor(hex);
  }, []);

  return (
    <AppearancePanel>
      <SectionList>
        <Row>
          <Copy>
            <Label>{t(CONTENTS.appearance.textColor)}</Label>
            <Hint>{t(CONTENTS.appearance.textColorHint)}</Hint>
          </Copy>

          <FieldBox>
            <DropdownField
              options={textColorOptions}
              value={textColor}
              onChange={setTextColor}
            />
          </FieldBox>
        </Row>

        <Row>
          <Copy>
            <Label>{t(CONTENTS.appearance.buttonColor)}</Label>
            <Hint>{t(CONTENTS.appearance.buttonColorHint)}</Hint>
          </Copy>

          <FieldBox>
            <DropdownField
              options={buttonColorOptions}
              value={buttonColor}
              onChange={setButtonColor}
            />
          </FieldBox>
        </Row>

        {buttonColor === BUTTON_COLOR_VALUES.CUSTOM ? (
          <InlineRow>
            <Copy>
              <Label>{t(CONTENTS.appearance.color)}</Label>
            </Copy>

            <InlineControlWrap>
              <InputField
                type={INPUT_TYPE.TEXT}
                value={hexColor}
                onChange={handleHexChange}
                onBlur={handleHexBlur}
                width="100%"
                height="46px"
                icon={
                  <Swatch
                    $interactive
                    $color={normalizeHexColor(
                      hexColor,
                      APPEARANCE_DEFAULT_HEX_COLOR,
                    )}
                  />
                }
                onIconClick={() => setColorPickerOpen(true)}
                variant={INPUT_VARIANTS.SURFACE}
              />
            </InlineControlWrap>
          </InlineRow>
        ) : null}
      </SectionList>

      {colorPickerOpen ? (
        <AppearanceColorPickerModal
          color={hexColor}
          fallbackHex={APPEARANCE_DEFAULT_HEX_COLOR}
          onClose={() => setColorPickerOpen(false)}
          onSelect={handleColorPicked}
        />
      ) : null}
    </AppearancePanel>
  );
}
