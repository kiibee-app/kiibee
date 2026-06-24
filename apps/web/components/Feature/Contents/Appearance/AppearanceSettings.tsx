"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { DEFAULT_HEX, FORM_FIELDS } from "@/utils/appearance";
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
  HEX_COLOR_INPUT_RE,
  normalizeHexColor,
} from "@/utils/appearance";
import AppearanceColorPickerModal from "@/components/UI/Modals/ColorPickerModal";
import { useAppearanceForm } from "./AppearanceFormContext";

export default function AppearanceSettingsSection() {
  const { t } = useTranslation();
  const { values, errors, updateField, clearFieldError, validateField } =
    useAppearanceForm();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const textColorOptions = useMemo(() => getTextColorOptions(t), [t]);
  const buttonColorOptions = useMemo(() => getButtonColorOptions(t), [t]);

  const handleHexChange = useCallback(
    (value: string | string[]) => {
      clearFieldError(FORM_FIELDS.BUTTON_HEX);
      updateField(FORM_FIELDS.BUTTON_HEX, String(value));
    },
    [clearFieldError, updateField],
  );

  const handleHexBlur = useCallback(() => {
    if (HEX_COLOR_INPUT_RE.test(values.buttonHex.trim())) {
      updateField(
        FORM_FIELDS.BUTTON_HEX,
        normalizeHexColor(values.buttonHex, DEFAULT_HEX),
      );
    }

    validateField(FORM_FIELDS.BUTTON_HEX);
  }, [updateField, validateField, values.buttonHex]);

  const handleColorPicked = useCallback(
    (hex: string) => {
      updateField(FORM_FIELDS.BUTTON_HEX, hex);
      validateField(FORM_FIELDS.BUTTON_HEX);
    },
    [updateField, validateField],
  );

  const handleButtonColorChange = useCallback(
    (selectedColor: string | string[]) => {
      const colorValue = String(selectedColor);
      updateField(FORM_FIELDS.BUTTON_COLOR, colorValue);
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
              onChange={(value) =>
                updateField(FORM_FIELDS.TEXT_COLOR, String(value))
              }
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
                      $color={normalizeHexColor(values.buttonHex, DEFAULT_HEX)}
                    />
                  }
                  onIconClick={() => setColorPickerOpen(true)}
                  variant={INPUT_VARIANTS.SURFACE}
                  hasError={Boolean(errors.buttonHex)}
                  errorMessage={errors.buttonHex}
                />
                {colorPickerOpen ? (
                  <AppearanceColorPickerModal
                    color={values.buttonHex}
                    fallbackHex={DEFAULT_HEX}
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
