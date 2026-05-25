"use client";

import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";
import COLORS from "@repo/ui/colors";
import { ControlWrap, ItemText, GeneralPanel, List, ItemRow } from "./styles";
import { TextConfig } from "@/utils/paymentRequirements";
import { TRAILER_VISIBILITY } from "@/utils/content";
import { useContentForm } from "../ContentFormContext";

export default function TrailerList({ config }: { config?: TextConfig }) {
  const { t } = useTranslation();
  const { formState, updateField } = useContentForm();

  const visibilityOptions = [
    { value: TRAILER_VISIBILITY.PUBLIC, label: t(CONTENTS.general.public) },
    { value: TRAILER_VISIBILITY.HIDDEN, label: t(CONTENTS.general.hidden) },
  ];

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
              value={formState.trailerLink}
              onChange={(value) =>
                updateField(
                  "trailerLink",
                  Array.isArray(value) ? value.join("") : value,
                )
              }
              placeholder={
                config?.placeholder ??
                t(CONTENTS.general.trailerLinkPlaceholder)
              }
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
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
                onChange={(value) => updateField("visibility", value as string)}
              />
            </ControlWrap>
          </ItemRow>
        )}
      </List>
    </GeneralPanel>
  );
}
