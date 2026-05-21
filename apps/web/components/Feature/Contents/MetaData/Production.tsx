"use client";

import React, { useCallback, useState } from "react";
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

export default function ProductionSection() {
  const { t } = useTranslation();

  const [productionCompany, setProductionCompany] = useState("");
  const [manufacturerLink, setManufacturerLink] = useState("");
  const [tags, setTags] = useState("");

  const handleChange = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      maxLength?: number,
    ) =>
      (value: string | string[]) => {
        const text = Array.isArray(value) ? value.join("") : value;
        setter(maxLength ? text.slice(0, maxLength) : text);
      },
    [],
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
              value={productionCompany}
              onChange={handleChange(setProductionCompany)}
              placeholder={t("contents.metadata.production.companyPlaceholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </FieldWrapper>

          <FieldWrapper>
            <InputField
              type={INPUT_TYPE.TEXT}
              value={manufacturerLink}
              onChange={handleChange(setManufacturerLink)}
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
              value={tags}
              onChange={handleChange(setTags, maxLogoNameCharacters)}
              placeholder={t("contents.metadata.tags.placeholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </FieldWrapper>

          <HelperFormRow>
            <HelperText>{t("contents.metadata.tags.example")}</HelperText>
            <HelperText>
              {tags.length}/{maxLogoNameCharacters}
            </HelperText>
          </HelperFormRow>
        </FormRow>
      </SectionList>
    </AppearancePanel>
  );
}
