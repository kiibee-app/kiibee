"use client";

import React, { useCallback, useMemo } from "react";
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
  LogoImage,
  LogoUploadWrap,
} from "./styles";
import { CROP_SHAPE, INPUT_TYPE, LOGO_MODE } from "@/utils/ui";
import GenericButton from "@/components/UI/GenericButton";
import ImageUploadCropModal from "@/components/UI/ImageUploadCropModal";
import { useAppearanceForm } from "./AppearanceFormContext";

export default function LogoSection() {
  const { t } = useTranslation();
  const { values, updateField } = useAppearanceForm();
  const [open, setOpen] = React.useState(false);

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

  const handleModeChange = useCallback(
    (newMode: typeof LOGO_MODE.TEXT | typeof LOGO_MODE.PICTURE) => {
      updateField("logoType", newMode);
    },
    [updateField],
  );

  const handleChange = useCallback(
    (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : value;
      updateField("logoName", text.slice(0, maxLogoNameCharacters));
    },
    [updateField],
  );

  const isTextMode = values.logoType === LOGO_MODE.TEXT;

  const handleImageApply = (cropped: string) => {
    updateField("logoUrl", cropped);
    setOpen(false);
  };

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
                value={values.logoName}
                onChange={handleChange}
                placeholder={texts.placeholder}
                width="100%"
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
              />
            ) : (
              <LogoUploadWrap>
                <GenericButton
                  variant={VARIANT.PRIMARY}
                  minWidth="137px"
                  onClick={() => setOpen(true)}
                >
                  {texts.uploadButton}
                </GenericButton>

                {values.logoUrl && <LogoImage src={values.logoUrl} />}
              </LogoUploadWrap>
            )}
          </ControlWrap>

          {isTextMode && (
            <CounterRow>
              <CounterText>{texts.maxCharacter}</CounterText>
              <CounterText>
                {values.logoName.length}/{maxLogoNameCharacters}
              </CounterText>
            </CounterRow>
          )}
        </Row>
      </SectionList>
      <ImageUploadCropModal
        visible={open}
        titleUpload={t("creatorProfile.uploadPhotoTitle")}
        titleEdit={t("creatorProfile.editPhotoTitle")}
        image={values.logoUrl}
        onClose={() => setOpen(false)}
        onApply={handleImageApply}
        shape={CROP_SHAPE.RECT}
        cropWidth={250}
        cropHeight={60}
        recommendedText={true}
      />
    </AppearancePanel>
  );
}
