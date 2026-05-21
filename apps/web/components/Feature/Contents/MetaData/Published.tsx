"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import { ControlWrap, GeneralPanel, ItemText, List } from "../General/styles";
import { ItemRow } from "../Appearance/styles";
import { getCategoryOptions, CategoryKey, FIELD_KEYS } from "@/utils/content";

type FormState = {
  publishedYear: string;
  duration: string;
  category: CategoryKey | "";
};

export default function PublishedSection() {
  const { t } = useTranslation();

  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);

  const { control } = useForm<FormState>({
    defaultValues: {
      publishedYear: "",
      duration: "",
      category: "",
    },
  });

  const renderInput = (name: keyof FormState, placeholder: string) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputField
          value={field.value}
          onChange={field.onChange}
          placeholder={placeholder}
          width="100%"
          variant={INPUT_VARIANTS.PRIMARY_GRAY}
        />
      )}
    />
  );

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
            {renderInput(
              FIELD_KEYS.PUBLISHED_YEAR,
              t("contents.metadata.published.yearPlaceholder"),
            )}
          </ControlWrap>
        </ItemRow>

        <ItemRow>
          <ItemText>
            <MonoText $use="Body_SemiBold">
              {t("contents.metadata.published.duration")}
            </MonoText>
          </ItemText>

          <ControlWrap>
            {renderInput(
              FIELD_KEYS.DURATION,
              t("contents.metadata.published.durationPlaceholder"),
            )}
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
            <Controller
              name={FIELD_KEYS.CATEGORY}
              control={control}
              render={({ field }) => (
                <DropdownField
                  options={categoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </ControlWrap>
        </ItemRow>
      </List>
    </GeneralPanel>
  );
}
