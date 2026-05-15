"use client";

import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { CONTENTS } from "@/utils/translationKeys";
import { VARIANT } from "@/utils/Constants";
import { MODAL_ALIGN } from "@/utils/ui";
import { normalizeHexColor } from "@/utils/appearance";
import { HexRow, PickerChrome, PreviewSwatch } from "./styles";

type Props = {
  color: string;
  fallbackHex: string;
  onClose: () => void;
  onSelect: (hex: string) => void;
};

export default function AppearanceColorPickerModal({
  color,
  fallbackHex,
  onClose,
  onSelect,
}: Props) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(() =>
    normalizeHexColor(color, fallbackHex),
  );

  return (
    <GenericModal
      visible
      title={t(CONTENTS.appearance.chooseColor)}
      onClose={onClose}
      cancelLabel={t(CONTENTS.appearance.cancelColorPicker)}
      onCancel={onClose}
      confirmLabel={t(CONTENTS.appearance.selectColor)}
      onConfirm={() => onSelect(normalizeHexColor(draft, fallbackHex))}
      buttonRow
      showCloseButton={false}
      width="430px"
      spacing="sm"
      textAlign={MODAL_ALIGN.START}
      buttonAlign={MODAL_ALIGN.START}
      fullWidthButtons
      confirmVariant={VARIANT.PRIMARY}
    >
      <PickerChrome>
        <HexColorPicker color={draft} onChange={setDraft} />
      </PickerChrome>
      <HexRow>
        <PreviewSwatch $color={draft} aria-hidden />
        <MonoText $use="Body_Medium" aria-live="polite">
          {draft.toUpperCase()}
        </MonoText>
      </HexRow>
    </GenericModal>
  );
}
