"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import { RequiredIndicator } from "@/components/UI/InputFields/styles";
import DropdownField, {
  type OptionItem,
} from "@/components/UI/InputFields/DropdownField";
import { MonoText } from "@/components/UI/Monotext";
import { CONTENT_FORM_FIELDS, INPUT_VARIANTS } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import { ControlWrap, GeneralPanel, ItemText, List } from "../General/styles";
import { ItemRow } from "../Appearance/styles";
import { useContentForm } from "../ContentFormContext";
import { useGetAPI } from "@/lib/http/api";
import { API } from "@/lib/http/api";

type TaxonomyItem = { id: string; name: string };
type ApiResponse<T> = { data?: T | null };

export default function PublishedSection() {
  const { t } = useTranslation();
  const { formState, formErrors, updateField, clearFieldError } =
    useContentForm();
  const [isDurationFocused, setIsDurationFocused] = useState(false);

  const categoriesQuery = useGetAPI<ApiResponse<TaxonomyItem[]>>(
    API.content.categories,
  );

  const categoryOptions = useMemo((): OptionItem[] => {
    const items = categoriesQuery.data?.data;
    if (!Array.isArray(items)) return [];
    return items
      .filter((item) => item.id && item.name)
      .map((item) => ({
        value: item.id,
        label: item.name,
      }));
  }, [categoriesQuery.data]);

  const handleInputChange =
    (field: keyof typeof formState) => (value: string | string[]) => {
      let text = Array.isArray(value) ? value.join("") : value;
      if (
        field === CONTENT_FORM_FIELDS.PUBLISHED_YEAR ||
        field === CONTENT_FORM_FIELDS.DURATION
      ) {
        text = text.replace(/\D/g, "");
      }
      if (
        field === CONTENT_FORM_FIELDS.PUBLISHED_YEAR ||
        field === CONTENT_FORM_FIELDS.DURATION ||
        field === CONTENT_FORM_FIELDS.CATEGORY
      ) {
        clearFieldError(field);
      }
      updateField(field, text);
    };

  return (
    <GeneralPanel>
      <List>
        <ItemRow>
          <ItemText>
            <MonoText $use="Body_SemiBold">
              {t("contents.metadata.published.title")}
              <RequiredIndicator>*</RequiredIndicator>
            </MonoText>
          </ItemText>

          <ControlWrap>
            <InputField
              value={formState.publishedYear}
              onChange={handleInputChange(CONTENT_FORM_FIELDS.PUBLISHED_YEAR)}
              placeholder={t("contents.metadata.published.yearPlaceholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              hasError={Boolean(formErrors.publishedYear)}
              inputMode="numeric"
            />
          </ControlWrap>
        </ItemRow>

        <ItemRow>
          <ItemText>
            <MonoText $use="Body_SemiBold">
              {t("contents.metadata.published.duration")}
              <RequiredIndicator>*</RequiredIndicator>
            </MonoText>
          </ItemText>

          <ControlWrap>
            <InputField
              value={
                isDurationFocused
                  ? formState.duration
                  : formState.duration
                    ? `${formState.duration} min`
                    : ""
              }
              onChange={handleInputChange(CONTENT_FORM_FIELDS.DURATION)}
              onFocus={() => setIsDurationFocused(true)}
              onBlur={() => setIsDurationFocused(false)}
              placeholder={t("contents.metadata.published.durationPlaceholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              hasError={Boolean(formErrors.duration)}
              inputMode="numeric"
            />
          </ControlWrap>
        </ItemRow>

        <ItemRow>
          <ItemText>
            <MonoText $use="Body_SemiBold">
              {t("contents.metadata.published.category")}
              <RequiredIndicator>*</RequiredIndicator>
            </MonoText>

            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {t("contents.metadata.published.categoryDescription")}
            </MonoText>
          </ItemText>

          <ControlWrap>
            <DropdownField
              options={categoryOptions}
              value={formState.category}
              onChange={(value) => {
                clearFieldError(CONTENT_FORM_FIELDS.CATEGORY);
                updateField(CONTENT_FORM_FIELDS.CATEGORY, String(value));
              }}
            />
          </ControlWrap>
        </ItemRow>
      </List>
    </GeneralPanel>
  );
}
