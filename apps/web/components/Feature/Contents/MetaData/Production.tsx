"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import { INPUT_VARIANTS, maxLogoNameCharacters } from "@/utils/Constants";
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
  const { t } = useTranslation();
  const { formState, updateField } = useContentForm();

  const handleFieldChange =
    (
      field: "productionCompany" | "manufacturerLink" | "tags",
      maxLength?: number,
    ) =>
    (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : value;
      const truncated = maxLength ? text.slice(0, maxLength) : text;
      updateField(field, truncated);
    };

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
              value={formState.productionCompany}
              onChange={handleFieldChange("productionCompany")}
              placeholder={t("contents.metadata.production.companyPlaceholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </FieldWrapper>

          <FieldWrapper>
            <InputField
              type={INPUT_TYPE.TEXT}
              value={formState.manufacturerLink}
              onChange={handleFieldChange("manufacturerLink")}
              placeholder={t("contents.metadata.production.linkPlaceholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </FieldWrapper>
        </FormRow>

        <FormRow>
          <SectionHeader>
            <Title>{t("contents.metadata.tags.title")}</Title>
          </SectionHeader>

          <FieldWrapper>
            <InputField
              type={INPUT_TYPE.TEXT}
              value={formState.tags}
              onChange={handleFieldChange("tags", maxLogoNameCharacters)}
              placeholder={t("contents.metadata.tags.placeholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
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
