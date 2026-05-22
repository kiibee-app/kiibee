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
import { Directions } from "@/utils/ui";

export default function PublishedSection() {
  const { t } = useTranslation();
  const { formState, updateField } = useContentForm();

  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);

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
              onChange={(value) =>
                updateField(
                  "publishedYear",
                  Array.isArray(value) ? value.join("") : value,
                )
              }
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
              onChange={(value) =>
                updateField(
                  "duration",
                  Array.isArray(value) ? value.join("") : value,
                )
              }
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
              onChange={(value) => updateField("category", value)}
              arrowDirection={Directions.RIGHT}
            />
          </ControlWrap>
        </ItemRow>
      </List>
    </GeneralPanel>
  );
}
