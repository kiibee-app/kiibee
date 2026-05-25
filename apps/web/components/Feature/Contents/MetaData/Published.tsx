"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import { ControlWrap, GeneralPanel, ItemText, List } from "../General/styles";
import { ItemRow } from "../Appearance/styles";
import { getCategoryOptions } from "@/utils/content";
import { useContentForm } from "../ContentFormContext";

export default function PublishedSection() {
  const { t } = useTranslation();
  const { formState, updateField } = useContentForm();

  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);

  const handleInputChange =
    (field: keyof typeof formState) => (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : value;
      updateField(field, text);
    };

  return (
    <GeneralPanel>
      <List>
        <ItemRow>
          <ItemText>
            <MonoText $use="Body_SemiBold">
              {t("contents.metadata.published.title")}
            </MonoText>
          </ItemText>

          <ControlWrap>
            <InputField
              value={formState.publishedYear}
              onChange={handleInputChange("publishedYear")}
              placeholder={t("contents.metadata.published.yearPlaceholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </ControlWrap>
        </ItemRow>

        <ItemRow>
          <ItemText>
            <MonoText $use="Body_SemiBold">
              {t("contents.metadata.published.duration")}
            </MonoText>
          </ItemText>

          <ControlWrap>
            <InputField
              value={formState.duration}
              onChange={handleInputChange("duration")}
              placeholder={t("contents.metadata.published.durationPlaceholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </ControlWrap>
        </ItemRow>

        <ItemRow>
          <ItemText>
            <MonoText $use="Body_SemiBold">
              {t("contents.metadata.published.category")}
            </MonoText>

            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {t("contents.metadata.published.categoryDescription")}
            </MonoText>
          </ItemText>

          <ControlWrap>
            <DropdownField
              options={categoryOptions}
              value={formState.category}
              onChange={(value) => updateField("category", String(value))}
            />
          </ControlWrap>
        </ItemRow>
      </List>
    </GeneralPanel>
  );
}
