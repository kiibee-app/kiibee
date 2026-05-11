"use client";

import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import GenericButton from "@/components/UI/GenericButton";
import { GenericModal } from "@/components/UI/Modals";
import {
  HiddenInput,
  UploadHint,
  UploadOrText,
} from "@/components/UI/ImageUploadCropModal/styles";
import { BackButton } from "../ContentTypeModal/styles";
import { VARIANT } from "@/utils/Constants";
import type { ContentType } from "@/utils/content";
import {
  ChooseUploadButton,
  ContentUploadDropZone,
  SelectedFileName,
  UploadBody,
  UploadHelperText,
  UploadModalContent,
} from "./styles";

const UPLOAD_CONFIG = {
  video: {
    accept: ".mp4,.mkv,.mov,.m4v",
    extensions: [".mp4", ".mkv", ".mov", ".m4v"],
  },
  audio: {
    accept: ".mp3,.m4a,.wav,.wma,.alac,.flac,.ogg,.aac",
    extensions: [
      ".mp3",
      ".m4a",
      ".wav",
      ".wma",
      ".alac",
      ".flac",
      ".ogg",
      ".aac",
    ],
  },
  pdf: {
    accept: ".pdf",
    extensions: [".pdf"],
  },
  epub: {
    accept: ".epub,.mobi,.azw",
    extensions: [".epub", ".mobi", ".azw"],
  },
} as const;

type UploadContentType = keyof typeof UPLOAD_CONFIG;

type ContentUploadModalProps = {
  visible: boolean;
  contentType: ContentType | null;
  onBack: () => void;
  onClose: () => void;
};

export default function ContentUploadModal({
  visible,
  contentType,
  onBack,
  onClose,
}: ContentUploadModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadType: UploadContentType =
    contentType === "audio" || contentType === "pdf" || contentType === "epub"
      ? contentType
      : "video";
  const uploadConfig = UPLOAD_CONFIG[uploadType];
  const helperLineTwo = t(
    `contents.contentUploadModal.${uploadType}.helperLineTwo`,
  );

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  const handleBack = () => {
    setSelectedFile(null);
    onBack();
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];
    const isSupportedFile = uploadConfig.extensions.some((extension) =>
      file?.name.toLowerCase().endsWith(extension),
    );
    if (!file || !isSupportedFile) return;

    setSelectedFile(file);
  };

  return (
    <GenericModal
      visible={visible}
      onClose={handleClose}
      width="670px"
      height="450px"
      padding="20px"
      borderRadius="20px"
    >
      <BackButton
        type="button"
        aria-label={t("common.back", { defaultValue: "Back" })}
        onClick={handleBack}
      >
        <BackButtonIcon size={28} strokeWidth={2.5} />
      </BackButton>

      <UploadModalContent>
        <UploadBody>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept={uploadConfig.accept}
            onChange={handleSelectFile}
          />

          <ContentUploadDropZone
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <UploadHint>
              {selectedFile
                ? t("contents.contentUploadModal.selectedFile")
                : t("contents.contentUploadModal.dragFileHere")}
            </UploadHint>

            {selectedFile ? (
              <SelectedFileName title={selectedFile.name}>
                {selectedFile.name}
              </SelectedFileName>
            ) : (
              <UploadOrText>{t("contents.contentUploadModal.or")}</UploadOrText>
            )}

            <ChooseUploadButton>
              <GenericButton
                variant={VARIANT.PRIMARY}
                minWidth="182px"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("contents.contentUploadModal.chooseFile")}
              </GenericButton>
            </ChooseUploadButton>

            <UploadHelperText>
              {t(`contents.contentUploadModal.${uploadType}.helperLineOne`)}
              <br />
              {helperLineTwo || "\u00a0"}
            </UploadHelperText>
          </ContentUploadDropZone>
        </UploadBody>
      </UploadModalContent>
    </GenericModal>
  );
}
