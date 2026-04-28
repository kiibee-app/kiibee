"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { CONTENT_TYPE_OPTIONS, type ContentType } from "@/utils/content";
import {
  BackButton,
  ContinueButton,
  HeadingGroup,
  ModalContent,
  ModalSubtitle,
  ModalTitle,
  TypeButton,
  TypeGrid,
  TypeLabel,
} from "./styles";

type ContentTypeModalProps = {
  visible: boolean;
  onBack?: () => void;
  onClose: () => void;
  onContinue?: (contentType: ContentType) => void;
};

export default function ContentTypeModal({
  visible,
  onBack,
  onClose,
  onContinue,
}: ContentTypeModalProps) {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);

  const handleContinue = () => {
    if (!selectedType) return;
    onContinue?.(selectedType);
  };

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      width="670px"
      height="450px"
      padding="20px"
      borderRadius="20px"
    >
      <BackButton
        type="button"
        aria-label={t("common.back", { defaultValue: "Back" })}
        onClick={onBack ?? onClose}
      >
        <BackButtonIcon size={28} strokeWidth={2.5} />
      </BackButton>

      <ModalContent>
        <HeadingGroup>
          <ModalTitle>{t("contents.contentTypeModal.title")}</ModalTitle>
          <ModalSubtitle>
            {t("contents.contentTypeModal.subtitle")}
          </ModalSubtitle>
        </HeadingGroup>

        <TypeGrid>
          {CONTENT_TYPE_OPTIONS.map(({ key, labelKey, Icon }) => (
            <TypeButton
              key={key}
              type="button"
              $selected={selectedType === key}
              aria-pressed={selectedType === key}
              onClick={() => setSelectedType(key)}
            >
              <Icon width={18} height={18} />
              <TypeLabel>{t(labelKey)}</TypeLabel>
            </TypeButton>
          ))}
        </TypeGrid>

        <ContinueButton
          type="button"
          disabled={!selectedType}
          onClick={handleContinue}
        >
          <MonoText $use="Body_Bold" color="inherit">
            {t("contents.contentTypeModal.continue")}
          </MonoText>
        </ContinueButton>
      </ModalContent>
    </GenericModal>
  );
}
