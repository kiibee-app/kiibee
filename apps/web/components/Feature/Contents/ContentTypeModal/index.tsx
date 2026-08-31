"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import {
  CONTENT_TYPE_OPTIONS,
  type ContentType,
  type ContentTypeOption,
} from "@/utils/content";
import {
  BackButton,
  CompactHeadingGroup,
  CompactModalContent,
  KindContinueButton,
  ModalSubtitle,
  ModalTitle,
  TypeButton,
  TypeGrid,
  TypeLabel,
} from "./styles";

type ContentTypeModalProps = {
  visible: boolean;
  options?: readonly ContentTypeOption[];
  onBack?: () => void;
  onClose: () => void;
  onContinue?: (contentType: ContentType) => void;
};

export default function ContentTypeModal({
  visible,
  options = CONTENT_TYPE_OPTIONS,
  onBack,
  onClose,
  onContinue,
}: ContentTypeModalProps) {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const typeOptions = options.length ? options : CONTENT_TYPE_OPTIONS;

  const handleModalClose = () => {
    setSelectedType(null);
    onClose();
  };

  const handleContinue = () => {
    if (!selectedType) return;
    onContinue?.(selectedType);
  };

  return (
    <GenericModal
      visible={visible}
      onClose={handleModalClose}
      width="560px"
      padding="24px"
      borderRadius="20px"
    >
      <BackButton
        type="button"
        aria-label={t("common.back", { defaultValue: "Back" })}
        onClick={onBack ?? handleModalClose}
      >
        <BackButtonIcon size={28} strokeWidth={2.5} />
      </BackButton>

      <CompactModalContent>
        <CompactHeadingGroup>
          <ModalTitle>{t("contents.contentTypeModal.title")}</ModalTitle>
          <ModalSubtitle>
            {t("contents.contentTypeModal.subtitle")}
          </ModalSubtitle>
        </CompactHeadingGroup>

        <TypeGrid $columns={typeOptions.length}>
          {typeOptions.map(({ key, labelKey, Icon }) => (
            <TypeButton
              key={key}
              type="button"
              $selected={selectedType === key}
              aria-pressed={selectedType === key}
              onClick={() => setSelectedType(key)}
            >
              <Icon width={24} height={24} />
              <TypeLabel>{t(labelKey)}</TypeLabel>
            </TypeButton>
          ))}
        </TypeGrid>

        <KindContinueButton
          type="button"
          disabled={!selectedType}
          onClick={handleContinue}
        >
          <MonoText $use="Body_Bold" color="inherit">
            {t("contents.contentTypeModal.continue")}
          </MonoText>
        </KindContinueButton>
      </CompactModalContent>
    </GenericModal>
  );
}
