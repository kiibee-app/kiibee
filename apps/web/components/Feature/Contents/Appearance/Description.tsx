"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import {
  CONTENT_FORM_FIELDS,
  INPUT_VARIANTS,
  maxDescriptionCharacters,
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
  Row,
  SectionList,
} from "./styles";
import { INPUT_TYPE } from "@/utils/ui";
import { useContentForm } from "../ContentFormContext";
import { FORM_FIELDS } from "@/utils/appearance";
import { useAppearanceForm } from "./AppearanceFormContext";

interface DescriptionSectionProps {
  showTitle?: boolean;
  useFormContext?: boolean;
}

export default function DescriptionSection({
  showTitle = false,
  useFormContext = false,
}: DescriptionSectionProps) {
  const { t } = useTranslation();
  const { formState, formErrors, updateField, clearFieldError } =
    useContentForm();
  const {
    values: appearanceValues,
    errors: appearanceErrors,
    updateField: updateAppearanceField,
    clearFieldError: clearAppearanceFieldError,
    validateField: validateAppearanceField,
  } = useAppearanceForm();
  const [localTitle, setLocalTitle] = useState("");
  const [localDescription, setLocalDescription] = useState("");
  const title = useFormContext ? formState.title : localTitle;
  const description = useFormContext
    ? formState.description
    : showTitle
      ? localDescription
      : appearanceValues.description;
  const handleDescriptionChange = (value: string | string[]) => {
    const text = Array.isArray(value) ? value.join("") : value;
    const truncated = text.slice(0, maxDescriptionCharacters);
    if (useFormContext) {
      clearFieldError(CONTENT_FORM_FIELDS.DESCRIPTION);
      updateField(CONTENT_FORM_FIELDS.DESCRIPTION, truncated);
    } else if (!showTitle) {
      clearAppearanceFieldError(FORM_FIELDS.DESCRIPTION);
      updateAppearanceField(FORM_FIELDS.DESCRIPTION, truncated);
    } else {
      setLocalDescription(truncated);
    }
  };

  const handleTitleChange = (value: string | string[]) => {
    const text = Array.isArray(value) ? value.join("") : value;
    if (useFormContext) {
      clearFieldError(CONTENT_FORM_FIELDS.TITLE);
      updateField(CONTENT_FORM_FIELDS.TITLE, text);
    } else {
      setLocalTitle(text);
    }
  };

  return (
    <AppearancePanel>
      <SectionList>
        {showTitle && (
          <Row>
            <Copy>
              <Label>{t("contents.contentUploadModal.details.title")}</Label>
            </Copy>

            <ControlWrap>
              <InputField
                type={INPUT_TYPE.TEXT}
                value={title}
                onChange={handleTitleChange}
                placeholder={t(
                  "contents.contentUploadModal.details.titlePlaceholder",
                )}
                width="100%"
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                hasError={useFormContext && Boolean(formErrors.title)}
                errorMessage={useFormContext ? formErrors.title : undefined}
              />
            </ControlWrap>
          </Row>
        )}

        <Row>
          <Copy>
            <Label>{t(CONTENTS.appearance.description.label)}</Label>
            {!showTitle && (
              <Hint>{t(CONTENTS.appearance.description.hint)}</Hint>
            )}
          </Copy>

          <ControlWrap>
            <InputField
              type={INPUT_TYPE.TEXTAREA}
              value={description}
              onChange={handleDescriptionChange}
              placeholder={t(CONTENTS.appearance.description.placeholder)}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              onBlur={() => {
                if (!useFormContext && !showTitle) {
                  validateAppearanceField(FORM_FIELDS.DESCRIPTION);
                }
              }}
              hasError={
                useFormContext
                  ? Boolean(formErrors.description)
                  : Boolean(appearanceErrors.description)
              }
              errorMessage={
                useFormContext
                  ? formErrors.description
                  : appearanceErrors.description
              }
            />
          </ControlWrap>

          {!showTitle && (
            <CounterRow>
              <CounterText>
                {t(CONTENTS.appearance.maximumCharacter)}
              </CounterText>
              <CounterText>
                {description.length}/{maxDescriptionCharacters}
              </CounterText>
            </CounterRow>
          )}
        </Row>
      </SectionList>
    </AppearancePanel>
  );
}
