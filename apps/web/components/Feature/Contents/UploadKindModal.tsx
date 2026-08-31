"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlaylistIcon, VideoIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import {
  UPLOAD_KIND,
  UPLOAD_KIND_I18N,
  UPLOAD_KIND_MODAL,
  UPLOAD_KIND_ORDER,
  type UploadKind,
} from "@/utils/collection";
import type { IconComponent } from "@/utils/content";
import {
  CompactHeadingGroup,
  CompactModalContent,
  KindButton,
  KindContinueButton,
  KindGrid,
  KindHint,
  KindIconBadge,
  KindLabel,
  KindModalSubtitle,
  KindModalTitle,
} from "./ContentTypeModal/styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onContinue: (kind: UploadKind) => void;
};

const UPLOAD_KIND_ICONS: Record<UploadKind, IconComponent> = {
  [UPLOAD_KIND.COLLECTION]: PlaylistIcon,
  [UPLOAD_KIND.SINGLE_CONTENT]: VideoIcon,
};

export default function UploadKindModal({
  visible,
  onClose,
  onContinue,
}: Props) {
  const { t } = useTranslation();
  const [selectedKind, setSelectedKind] = useState<UploadKind | null>(null);

  const handleClose = () => {
    setSelectedKind(null);
    onClose();
  };

  const handleContinue = () => {
    if (!selectedKind) return;
    onContinue(selectedKind);
    setSelectedKind(null);
  };

  return (
    <GenericModal
      visible={visible}
      onClose={handleClose}
      width={UPLOAD_KIND_MODAL.WIDTH}
      padding={UPLOAD_KIND_MODAL.PADDING}
      borderRadius={UPLOAD_KIND_MODAL.BORDER_RADIUS}
    >
      <CompactModalContent>
        <CompactHeadingGroup>
          <KindModalTitle>{t(UPLOAD_KIND_I18N.title)}</KindModalTitle>
          <KindModalSubtitle>{t(UPLOAD_KIND_I18N.subtitle)}</KindModalSubtitle>
        </CompactHeadingGroup>

        <KindGrid>
          {UPLOAD_KIND_ORDER.map((key) => {
            const selected = selectedKind === key;
            const Icon = UPLOAD_KIND_ICONS[key];
            const { label, hint } = UPLOAD_KIND_I18N.options[key];

            return (
              <KindButton
                key={key}
                type="button"
                $selected={selected}
                aria-pressed={selected}
                onClick={() => setSelectedKind(key)}
              >
                <KindIconBadge>
                  <Icon
                    width={UPLOAD_KIND_MODAL.ICON_SIZE}
                    height={UPLOAD_KIND_MODAL.ICON_SIZE}
                  />
                </KindIconBadge>
                <KindLabel>{t(label)}</KindLabel>
                <KindHint>{t(hint)}</KindHint>
              </KindButton>
            );
          })}
        </KindGrid>

        <KindContinueButton
          type="button"
          disabled={!selectedKind}
          onClick={handleContinue}
        >
          <MonoText $use="Body_Medium" color="inherit">
            {t(UPLOAD_KIND_I18N.continue)}
          </MonoText>
        </KindContinueButton>
      </CompactModalContent>
    </GenericModal>
  );
}
