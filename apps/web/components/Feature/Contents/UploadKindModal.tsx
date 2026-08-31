"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlaylistIcon, VideoIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { UPLOAD_KIND, type UploadKind } from "@/utils/collection";
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

const UPLOAD_KIND_OPTIONS = [
  {
    key: UPLOAD_KIND.COLLECTION,
    labelKey: "contents.uploadKindModal.options.collection",
    hintKey: "contents.uploadKindModal.options.collectionHint",
    Icon: PlaylistIcon,
  },
  {
    key: UPLOAD_KIND.SINGLE_CONTENT,
    labelKey: "contents.uploadKindModal.options.singleContent",
    hintKey: "contents.uploadKindModal.options.singleContentHint",
    Icon: VideoIcon,
  },
] as const;

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
      width="400px"
      padding="28px 24px 24px"
      borderRadius="20px"
    >
      <CompactModalContent>
        <CompactHeadingGroup>
          <KindModalTitle>{t("contents.uploadKindModal.title")}</KindModalTitle>
          <KindModalSubtitle>
            {t("contents.uploadKindModal.subtitle")}
          </KindModalSubtitle>
        </CompactHeadingGroup>

        <KindGrid>
          {UPLOAD_KIND_OPTIONS.map(({ key, labelKey, hintKey, Icon }) => {
            const selected = selectedKind === key;
            return (
              <KindButton
                key={key}
                type="button"
                $selected={selected}
                aria-pressed={selected}
                onClick={() => setSelectedKind(key)}
              >
                <KindIconBadge>
                  <Icon width={26} height={26} />
                </KindIconBadge>
                <KindLabel>{t(labelKey)}</KindLabel>
                <KindHint>{t(hintKey)}</KindHint>
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
            {t("contents.uploadKindModal.continue")}
          </MonoText>
        </KindContinueButton>
      </CompactModalContent>
    </GenericModal>
  );
}
