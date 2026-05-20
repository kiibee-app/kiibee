"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";
import COLORS from "@repo/ui/colors";
import { ControlWrap, ItemText, GeneralPanel, List, ItemRow } from "./styles";
import { TRAILER_VISIBILITY, TrailerVisibility } from "@/utils/content";

export default function TrailerList() {
  const { t } = useTranslation();
  const [trailerLink, setTrailerLink] = useState("");
  const [visibility, setVisibility] = useState<TrailerVisibility>(
    TRAILER_VISIBILITY.PUBLIC,
  );
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
              {t(CONTENTS.general.trailerLink)}
            </MonoText>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {t(CONTENTS.general.trailerLinkHint)}
            </MonoText>
          </ItemText>
          <ControlWrap>
            <InputField
              value={trailerLink}
              onChange={(value) =>
                setTrailerLink(Array.isArray(value) ? value.join("") : value)
              }
              placeholder={t(CONTENTS.general.trailerLinkPlaceholder)}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </ControlWrap>
        </ItemRow>
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
              value={visibility}
              onChange={(value) => setVisibility(value as TrailerVisibility)}
            />
          </ControlWrap>
        </ItemRow>
      </List>
    </GeneralPanel>
  );
}
