"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import {
  INPUT_VARIANTS,
  maxLogoNameCharacters,
  VARIANT,
} from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";
import { AppearancePanel } from "../styles";
import {
  ControlWrap,
  Copy,
  CounterRow,
  CounterText,
  Hint,
  Label,
  SectionList,
  ToggleWrap,
  ToggleButton,
  LogoHeader,
  Row,
} from "./styles";
import { INPUT_TYPE, LOGO_MODE, Mode } from "@/utils/ui";
import GenericButton from "@/components/UI/GenericButton";

export default function LogoSection() {
  const { t } = useTranslation();

  const [mode, setMode] = useState<Mode>(LOGO_MODE.TEXT);
  const [logoText, setLogoText] = useState("");

  const texts = useMemo(
    () => ({
      title: t(CONTENTS.appearance.logo.title),
      subtitle: t(CONTENTS.appearance.logo.subtitle),
      placeholder: t(CONTENTS.appearance.logo.placeholder),
      toggleText: t(CONTENTS.appearance.logo.toggleText),
      togglePicture: t(CONTENTS.appearance.logo.togglePicture),
      uploadButton: t(CONTENTS.appearance.logo.uploadButton),
      maxCharacter: t(CONTENTS.appearance.maximumCharacter),
    }),
    [t],
  );

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, []);

  const handleChange = useCallback((value: string | string[]) => {
    const text = Array.isArray(value) ? value.join("") : value;
    setLogoText(text.slice(0, maxLogoNameCharacters));
  }, []);

  const isTextMode = mode === LOGO_MODE.TEXT;

  return (
    <AppearancePanel>
      <SectionList>
        <Row>
          <LogoHeader>
            <Copy>
              <Label>{texts.title}</Label>
              <Hint>{texts.subtitle}</Hint>
            </Copy>

            <ToggleWrap>
              <ToggleButton
                $active={isTextMode}
                onClick={() => handleModeChange(LOGO_MODE.TEXT)}
              >
                {texts.toggleText}
              </ToggleButton>

              <ToggleButton
                $active={!isTextMode}
                onClick={() => handleModeChange(LOGO_MODE.PICTURE)}
              >
                {texts.togglePicture}
              </ToggleButton>
            </ToggleWrap>
          </LogoHeader>

          <ControlWrap>
            {isTextMode ? (
              <InputField
                type={INPUT_TYPE.TEXT}
                value={logoText}
                onChange={handleChange}
                placeholder={texts.placeholder}
                width="100%"
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
              />
            ) : (
              <GenericButton variant={VARIANT.PRIMARY} minWidth="137px">
                {texts.uploadButton}
              </GenericButton>
            )}
          </ControlWrap>

          {isTextMode && (
            <CounterRow>
              <CounterText>{texts.maxCharacter}</CounterText>
              <CounterText>
                {logoText.length}/{maxLogoNameCharacters}
              </CounterText>
            </CounterRow>
          )}
        </Row>
      </SectionList>
    </AppearancePanel>
  );
}
