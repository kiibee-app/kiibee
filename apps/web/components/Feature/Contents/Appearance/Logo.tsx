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
  PreviewWrapper,
  DeleteImageButton,
} from "./styles";
import { DeleteIcon } from "@/assets/icons";
import { FORM_FIELDS } from "@/utils/appearance";
import { CROP_SHAPE, INPUT_TYPE, LOGO_MODE } from "@/utils/ui";
import GenericButton from "@/components/UI/GenericButton";
import ImageUploadCropModal from "@/components/UI/ImageUploadCropModal";
import { useAppearanceForm } from "./AppearanceFormContext";
import { ErrorText } from "../MetaData/styles";

export default function LogoSection() {
  const { t } = useTranslation();
  const { values, errors, updateField, clearFieldError, validateField } =
    useAppearanceForm();
  const [open, setOpen] = React.useState(false);
  const [logoFit, setLogoFit] = React.useState<"cover" | "contain">("cover");

  const handleLogoLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const ar = img.naturalWidth / img.naturalHeight;
        setLogoFit(ar > 1.25 || ar < 0.8 ? "contain" : "cover");
      }
    },
    [],
  );

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
      updateField(FORM_FIELDS.LOGO_TYPE, newMode);
    },
    [updateField],
  );

  const handleChange = useCallback(
    (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : value;
      clearFieldError(FORM_FIELDS.LOGO_NAME);
      updateField(FORM_FIELDS.LOGO_NAME, text.slice(0, maxLogoNameCharacters));
    },
    [clearFieldError, updateField],
  );

  const isTextMode = values.logoType === LOGO_MODE.TEXT;

  const handleImageApply = (cropped: string) => {
    clearFieldError(FORM_FIELDS.LOGO_URL);
    updateField(FORM_FIELDS.LOGO_URL, cropped);
    validateField(FORM_FIELDS.LOGO_URL);
    setOpen(false);
  };

  const handleImageDelete = () => {
    clearFieldError(FORM_FIELDS.LOGO_URL);
    updateField(FORM_FIELDS.LOGO_URL, "");
    validateField(FORM_FIELDS.LOGO_URL);
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
                onBlur={() => validateField(FORM_FIELDS.LOGO_NAME)}
                placeholder={texts.placeholder}
                width="100%"
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                hasError={Boolean(errors.logoName)}
                errorMessage={errors.logoName}
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

                {values.logoUrl && (
                  <PreviewWrapper
                    onClick={() => setOpen(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <LogoImage
                      src={values.logoUrl}
                      $fit={logoFit}
                      onLoad={handleLogoLoad}
                    />
                    <DeleteImageButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageDelete();
                      }}
                    >
                      <DeleteIcon width={14} height={16} />
                    </DeleteImageButton>
                  </PreviewWrapper>
                )}
                {errors.logoUrl ? (
                  <ErrorText role="alert">{errors.logoUrl}</ErrorText>
                ) : null}
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
        shape={CROP_SHAPE.CIRCLE}
        recommendedText={false}
        uploadAsIs={true}
      />
    </AppearancePanel>
  );
}
