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

type Props = {
  id: string;
  uploadedFile?: File | null;
  uploadedPreview?: string | null;
  onDelete?: (id: string) => void;
};

export default function GeneralContent({
  id,
  uploadedPreview,
  uploadedFile,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  if (!uploadedFile) return null;
  const getFormatType = (file: File): FormatType => {
    const match = Object.entries(FILE_TYPE_CHECKERS).find(([, check]) =>
      check(file),
    );
    return (match?.[0] as FormatType) ?? FORMAT_TYPE.PDF;
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };
  const uploadType = getFormatType(uploadedFile);
  const previewUrl = uploadedPreview;

  const renderPreview = () => {
    switch (uploadType) {
      case FORMAT_TYPE.VIDEO:
        return (
          <PreviewBox>
            <PreviewVideo src={previewUrl ?? ""} controls={false} />
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

  return (
    <PanelStack>
      <GeneralPanel>
        <DetailsWrapper>
          <FileRow>
            <PreviewBox>{renderPreview()}</PreviewBox>

            <InfoColumn>
              <MonoText $use="Body_Medium">{uploadedFile.name}</MonoText>

              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
                {formatFileSize(uploadedFile.size)}
              </MonoText>
            </InfoColumn>
          </FileRow>
          <DeleteAction>
            <DeleteButton variant={VARIANT.PRIMARY} onClick={handleDelete}>
              {t("contents.contentUploadModal.deletePermanently")}{" "}
            </DeleteButton>
          </DeleteAction>
        </DetailsWrapper>
      </GeneralPanel>
      <TrailerList />
    </PanelStack>
  );
}
