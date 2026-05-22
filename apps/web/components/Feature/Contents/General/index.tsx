"use client";

import React from "react";
import {
  PanelStack,
  GeneralPanel,
  DetailsWrapper,
  DeleteButton,
  DeleteAction,
  InfoColumn,
  FileRow,
  PreviewBox,
  PreviewVideo,
  PlayOverlay,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { formatFileSize } from "@/utils/file";
import { FORMAT_TYPE, FormatType } from "@/utils/types";
import {
  PlayCircleIcon,
  UploadAudioIcon,
  UploadEpubIcon,
  UploadPdfIcon,
} from "@/assets/icons";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/variants";
import { FILE_TYPE_CHECKERS } from "@/utils/content";
import { useTranslation } from "react-i18next";
import TrailerList from "./TrailerList";
import type { CollectionContentRow } from "@/types/collectionsType";

type Props = {
  uploadedFile?: File | null;
  uploadedPreview?: string | null;
  editingContent?: CollectionContentRow | null;
};

export default function GeneralContent({
  uploadedPreview,
  uploadedFile,
  editingContent,
}: Props) {
  const { t } = useTranslation();
  if (!uploadedFile && !editingContent) return null;

  const getFormatType = (file: File): FormatType => {
    const match = Object.entries(FILE_TYPE_CHECKERS).find(([, check]) =>
      check(file),
    );
    const matchedKey = match?.[0];
    if (
      matchedKey === FORMAT_TYPE.VIDEO ||
      matchedKey === FORMAT_TYPE.AUDIO ||
      matchedKey === FORMAT_TYPE.PDF ||
      matchedKey === FORMAT_TYPE.EPUB ||
      matchedKey === FORMAT_TYPE.WEB
    ) {
      return matchedKey;
    }
    return FORMAT_TYPE.PDF;
  };

  const uploadType = uploadedFile
    ? getFormatType(uploadedFile)
    : editingContent?.contentType;
  const previewUrl = uploadedFile ? uploadedPreview : null;

  const renderPreview = () => {
    switch (uploadType) {
      case FORMAT_TYPE.VIDEO:
        return (
          <PreviewBox>
            <PreviewVideo src={previewUrl ?? undefined} controls={false} />
            <PlayOverlay>
              <PlayCircleIcon
                width={40}
                height={40}
                color={COLORS.neutral.GRAY_200}
              />
            </PlayOverlay>
          </PreviewBox>
        );

      case FORMAT_TYPE.AUDIO:
        return (
          <UploadAudioIcon width={64} height={64} color={COLORS.primary.RED} />
        );

      case FORMAT_TYPE.PDF:
        return (
          <UploadPdfIcon width={64} height={64} color={COLORS.primary.RED} />
        );

      case FORMAT_TYPE.EPUB:
        return (
          <UploadEpubIcon width={64} height={64} color={COLORS.primary.BLUE} />
        );

      default:
        return null;
    }
  };

  const fileName = uploadedFile
    ? uploadedFile.name
    : (editingContent?.name ?? "Untitled");
  const fileSize = uploadedFile ? formatFileSize(uploadedFile.size) : "1.2 KB";

  return (
    <PanelStack>
      <GeneralPanel>
        <DetailsWrapper>
          <FileRow>
            <PreviewBox>{renderPreview()}</PreviewBox>

            <InfoColumn>
              <MonoText $use="Body_Medium">{fileName}</MonoText>

              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
                {fileSize}
              </MonoText>
            </InfoColumn>
          </FileRow>
          <DeleteAction>
            <DeleteButton variant={VARIANT.PRIMARY}>
              {t("contents.contentUploadModal.deletePermanently")}{" "}
            </DeleteButton>
          </DeleteAction>
        </DetailsWrapper>
      </GeneralPanel>
      <TrailerList
        key={editingContent?.id ?? "create"}
        editingContent={editingContent}
      />
    </PanelStack>
  );
}
