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
  SubSection,
  Swatch,
  FieldBox,
} from "./styles";
import { INPUT_TYPE } from "@/utils/ui";
import {
  BUTTON_COLOR_VALUES,
  getButtonColorOptions,
  getTextColorOptions,
  normalizeHexColor,
} from "@/utils/appearance";
import AppearanceColorPickerModal from "@/components/UI/Modals/ColorPickerModal";
import { useAppearanceForm } from "./AppearanceFormContext";

export default function AppearanceSettingsSection() {
  const { t } = useTranslation();
  const { values, updateField } = useAppearanceForm();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const textColorOptions = useMemo(() => getTextColorOptions(t), [t]);
  const buttonColorOptions = useMemo(() => getButtonColorOptions(t), [t]);

  const handleHexChange = useCallback(
    (value: string | string[]) => {
      updateField("buttonHex", String(value));
    },
    [updateField],
  );

  const handleHexBlur = useCallback(() => {
    updateField(
      "buttonHex",
      normalizeHexColor(values.buttonHex, APPEARANCE_DEFAULT_HEX_COLOR),
    );
  }, [updateField, values.buttonHex]);

  const handleColorPicked = useCallback(
    (hex: string) => {
      updateField("buttonHex", hex);
    },
    [updateField],
  );

  const handleButtonColorChange = useCallback(
    (selectedColor: string | string[]) => {
      const colorValue = String(selectedColor);
      updateField("buttonColor", colorValue);
      if (colorValue === BUTTON_COLOR_VALUES.CUSTOM) {
        setColorPickerOpen(true);
      }
    },
    [updateField],
  );

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
              value={values.textColor}
              onChange={(value) => updateField("textColor", String(value))}
            />
          </FieldBox>
        </Row>

        <SubSection>
          <Row>
            <Copy>
              <Label>{t(CONTENTS.appearance.buttonColor)}</Label>
              <Hint>{t(CONTENTS.appearance.buttonColorHint)}</Hint>
            </Copy>

            <FieldBox>
              <DropdownField
                options={buttonColorOptions}
                value={values.buttonColor}
                onChange={handleButtonColorChange}
              />
            </FieldBox>
          </Row>

          {values.buttonColor === BUTTON_COLOR_VALUES.CUSTOM ? (
            <InlineRow>
              <Copy>
                <Label>{t(CONTENTS.appearance.color)}</Label>
              </Copy>

              <InlineControlWrap>
                <InputField
                  type={INPUT_TYPE.TEXT}
                  value={values.buttonHex}
                  onChange={handleHexChange}
                  onBlur={handleHexBlur}
                  width="100%"
                  height="46px"
                  icon={
                    <Swatch
                      $interactive
                      $color={normalizeHexColor(
                        values.buttonHex,
                        APPEARANCE_DEFAULT_HEX_COLOR,
                      )}
                    />
                  }
                  onIconClick={() => setColorPickerOpen(true)}
                  variant={INPUT_VARIANTS.SURFACE}
                />
                {colorPickerOpen ? (
                  <AppearanceColorPickerModal
                    color={values.buttonHex}
                    fallbackHex={APPEARANCE_DEFAULT_HEX_COLOR}
                    onClose={() => setColorPickerOpen(false)}
                    onSelect={handleColorPicked}
                  />
                ) : null}
              </InlineControlWrap>
            </InlineRow>
          ) : null}
        </SubSection>
      </SectionList>
    </AppearancePanel>
  );
}
