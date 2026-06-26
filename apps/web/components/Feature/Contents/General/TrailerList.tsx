"use client";

import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";
import COLORS from "@repo/ui/colors";
import { ControlWrap, ItemText, GeneralPanel, List, ItemRow } from "./styles";
import {
  PAYMENTS_FORM_FIELDS,
  TextConfig,
  TRAILER_FIELD_MAP,
} from "@/utils/paymentRequirements";
import { TRAILER_VISIBILITY } from "@/utils/content";
import { useContentForm } from "../ContentFormContext";

export default function TrailerList({ config }: { config?: TextConfig }) {
  const { t } = useTranslation();
  const { formState, updateField, formErrors, clearFieldError } =
    useContentForm();

  const visibilityOptions = [
    { value: TRAILER_VISIBILITY.PUBLIC, label: t(CONTENTS.general.public) },
    { value: TRAILER_VISIBILITY.HIDDEN, label: t(CONTENTS.general.hidden) },
    { value: TRAILER_VISIBILITY.DRAFT, label: t(CONTENTS.general.draft) },
  ];

  const linkField = config?.linkField ?? TRAILER_FIELD_MAP.TRAILER;

  const handleLink = (value: string | string[]) => {
    const valStr = Array.isArray(value) ? value.join("") : value;
    updateField(linkField, valStr);
    if (formErrors[linkField]) {
      clearFieldError(linkField);
    }
  };

  return (
    <GeneralPanel>
      <List>
        <ItemRow>
          <ItemText>
            <MonoText $use="Body_SemiBold">
              {config?.title ?? t(CONTENTS.general.trailerLink)}
            </MonoText>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {config?.description ?? t(CONTENTS.general.trailerLinkHint)}
            </MonoText>
          </ItemText>
          <ControlWrap>
            <InputField
              value={formState[linkField] ?? ""}
              onChange={handleLink}
              placeholder={
                config?.placeholder ??
                t(CONTENTS.general.trailerLinkPlaceholder)
              }
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              hasError={Boolean(formErrors[linkField])}
              errorMessage={formErrors[linkField]}
            />
          </ControlWrap>
        </ItemRow>

        {(config?.showVisibility ?? true) && (
          <ItemRow>
            <ItemText>
              <MonoText $use="Body_SemiBold">
                {t(CONTENTS.general.visibility)}
              </MonoText>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t(CONTENTS.general.visibilityHint)}
              </MonoText>
            </ItemText>

            <ControlWrap>
              <DropdownField
                options={visibilityOptions}
                value={formState.visibility}
                onChange={(value) =>
                  updateField(PAYMENTS_FORM_FIELDS.VISIBILITY, value as string)
                }
              />
            </ControlWrap>
          </ItemRow>
        )}
      </List>
    </GeneralPanel>
  );
}
