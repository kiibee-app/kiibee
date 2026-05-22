"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";
import COLORS from "@repo/ui/colors";
import { ControlWrap, ItemText, List, ItemRow } from "./styles";
import { TRAILER_VISIBILITY, TrailerVisibility } from "@/utils/content";
import type { CollectionContentRow } from "@/types/collectionsType";

type Props = {
  editingContent?: CollectionContentRow | null;
};

export default function TrailerList({ editingContent }: Props) {
  const { t } = useTranslation();
  const [trailerLink, setTrailerLink] = useState<string | null>(() => {
    if (
      editingContent &&
      "trailerLink" in editingContent &&
      typeof editingContent.trailerLink === "string"
    ) {
      return editingContent.trailerLink || null;
    }
    return null;
  });
  const [visibility, setVisibility] = useState<TrailerVisibility>(() => {
    if (editingContent) {
      const dbVisibility = editingContent.visibility;
      return dbVisibility === "Public"
        ? TRAILER_VISIBILITY.PUBLIC
        : TRAILER_VISIBILITY.HIDDEN;
    }
    return TRAILER_VISIBILITY.PUBLIC;
  });

  const visibilityOptions = [
    { value: TRAILER_VISIBILITY.PUBLIC, label: t(CONTENTS.general.public) },
    { value: TRAILER_VISIBILITY.HIDDEN, label: t(CONTENTS.general.private) },
  ];

  return (
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
            value={trailerLink ?? undefined}
            onChange={(value) => {
              const text = Array.isArray(value) ? value.join("") : value;
              setTrailerLink(text || null);
            }}
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
            onChange={(value) => {
              if (
                value === TRAILER_VISIBILITY.PUBLIC ||
                value === TRAILER_VISIBILITY.HIDDEN
              ) {
                setVisibility(value);
              }
            }}
          />
        </ControlWrap>
      </ItemRow>
    </List>
  );
}
