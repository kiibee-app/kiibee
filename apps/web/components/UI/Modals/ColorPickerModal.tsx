"use client";

import React, { useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { CONTENTS } from "@/utils/translationKeys";
import { VARIANT } from "@/utils/Constants";
import { normalizeHexColor } from "@/utils/appearance";
import {
  PopoverContainer,
  PopoverFooter,
  HexRow,
  PickerChrome,
  PreviewSwatch,
} from "./ColorPickerModal.styles";
import { useClickOutside } from "@/hooks/useClickOutside";
import GenericButton from "@/components/UI/GenericButton";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: containerRef,
    enabled: true,
    handler: onClose,
  });

  return (
    <PopoverContainer ref={containerRef}>
      <PickerChrome>
        <HexColorPicker color={draft} onChange={setDraft} />
      </PickerChrome>
      <HexRow>
        <PreviewSwatch $color={draft} aria-hidden />
        <MonoText $use="Body_Medium" aria-live="polite">
          {draft.toUpperCase()}
        </MonoText>
      </HexRow>
      <PopoverFooter>
        <GenericButton variant={VARIANT.SECONDARY} onClick={onClose}>
          {t(CONTENTS.appearance.cancelColorPicker)}
        </GenericButton>
        <GenericButton
          variant={VARIANT.PRIMARY}
          onClick={() => {
            onSelect(normalizeHexColor(draft, fallbackHex));
            onClose();
          }}
        >
          {t(CONTENTS.appearance.selectColor)}
        </GenericButton>
      </PopoverFooter>
    </PopoverContainer>
  );
}
