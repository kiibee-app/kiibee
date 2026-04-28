"use client";

import React, { useState } from "react";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import {
  AudioIcon,
  BackButtonIcon,
  EpubIcon,
  PdfIcon,
  VideoIcon,
  WebIcon,
} from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
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

export type ContentType = "video" | "audio" | "pdf" | "epub" | "web";

type IconComponent = ComponentType<{
  width?: number | string;
  height?: number | string;
  color?: string;
  title?: string;
}>;

type ContentTypeOption = {
  key: ContentType;
  labelKey: string;
  Icon: IconComponent;
};

const CONTENT_TYPE_OPTIONS: readonly ContentTypeOption[] = [
  {
    key: "video",
    labelKey: "contents.contentTypeModal.options.video",
    Icon: VideoIcon,
  },
  {
    key: "audio",
    labelKey: "contents.contentTypeModal.options.audio",
    Icon: AudioIcon,
  },
  {
    key: "pdf",
    labelKey: "contents.contentTypeModal.options.pdf",
    Icon: PdfIcon,
  },
  {
    key: "epub",
    labelKey: "contents.contentTypeModal.options.epub",
    Icon: EpubIcon,
  },
  {
    key: "web",
    labelKey: "contents.contentTypeModal.options.web",
    Icon: WebIcon,
  },
] as const;

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
