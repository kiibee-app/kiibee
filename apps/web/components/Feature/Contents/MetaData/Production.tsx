"use client";

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import TagsInput from "@/components/UI/InputFields/TagsInput";
import {
  CONTENT_FORM_FIELDS,
  INPUT_VARIANTS,
  maxLogoNameCharacters,
} from "@/utils/Constants";
import { AppearancePanel } from "../styles";
import {
  FieldWrapper,
  SectionHeader,
  HelperFormRow,
  HelperText,
  Description,
  Title,
  FormRow,
  SectionList,
} from "./styles";
import { INPUT_TYPE } from "@/utils/ui";
import { useContentForm } from "../ContentFormContext";

export default function ProductionSection() {
  const t = useTranslation().t;
  const { formState, formErrors, updateField, clearFieldError } =
    useContentForm();

  const handleChange = useCallback(
    (field: keyof typeof formState, maxLength?: number) =>
      (value: string | string[]) => {
        const text = Array.isArray(value) ? value.join("") : value;
        if (
          field === CONTENT_FORM_FIELDS.PRODUCTION_COMPANY ||
          field === CONTENT_FORM_FIELDS.MANUFACTURER_LINK ||
          field === CONTENT_FORM_FIELDS.TAGS
        ) {
          clearFieldError(field);
        }
        updateField(field, maxLength ? text.slice(0, maxLength) : text);
      },
    [clearFieldError, updateField],
  );

  return (
    <AppearancePanel>
      <SectionList>
        <FormRow>
          <SectionHeader>
            <Title>{t("contents.metadata.production.title")}</Title>
            <Description>
              {t("contents.metadata.production.description")}
            </Description>
          </SectionHeader>

          <FieldWrapper>
            <InputField
              type={INPUT_TYPE.TEXT}
              label={t("contents.metadata.production.companyPlaceholder")}
              required={false}
              value={formState.productionCompany}
              onChange={handleChange(CONTENT_FORM_FIELDS.PRODUCTION_COMPANY)}
              placeholder={t("contents.metadata.production.companyPlaceholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              hasError={Boolean(formErrors.productionCompany)}
              errorMessage={formErrors.productionCompany}
            />
          </FieldWrapper>

          <FieldWrapper>
            <InputField
              type={INPUT_TYPE.TEXT}
              label={t("contents.metadata.production.linkPlaceholder")}
              required={false}
              value={formState.manufacturerLink}
              onChange={handleChange(CONTENT_FORM_FIELDS.MANUFACTURER_LINK)}
              placeholder={t("contents.metadata.production.linkPlaceholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              hasError={Boolean(formErrors.manufacturerLink)}
              errorMessage={formErrors.manufacturerLink}
            />
          </FieldWrapper>
        </FormRow>

        <FormRow>
          <SectionHeader>
            <Title>{t("contents.metadata.tags.title")}</Title>
          </SectionHeader>

          <FieldWrapper>
            <TagsInput
              value={formState.tags}
              onChange={(value) => {
                clearFieldError(CONTENT_FORM_FIELDS.TAGS);
                updateField(
                  CONTENT_FORM_FIELDS.TAGS,
                  value.slice(0, maxLogoNameCharacters),
                );
              }}
              placeholder={t("contents.metadata.tags.placeholder")}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              hasError={Boolean(formErrors.tags)}
            />
          </FieldWrapper>

          <HelperFormRow>
            <HelperText>{t("contents.metadata.tags.example")}</HelperText>
            <HelperText>
              {formState.tags.length}/{maxLogoNameCharacters}
            </HelperText>
          </HelperFormRow>
        </FormRow>
      </SectionList>
    </AppearancePanel>
  );
}
