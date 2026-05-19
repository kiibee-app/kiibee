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

type Props = {
  uploadedFile?: File | null;
  uploadedPreview?: string | null;
};

export default function GeneralContent({
  uploadedPreview,
  uploadedFile,
}: Props) {
  if (!uploadedFile) return null;

  const getFormatType = (file: File): FormatType => {
    const type = file.type;

    if (type.startsWith("video/")) return FORMAT_TYPE.VIDEO;
    if (type.startsWith("audio/")) return FORMAT_TYPE.AUDIO;
    if (type === "application/pdf") return FORMAT_TYPE.PDF;
    if (file.name.endsWith(".epub")) return FORMAT_TYPE.EPUB;

    return FORMAT_TYPE.PDF;
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
            <DeleteButton variant={VARIANT.PRIMARY}>
              Delete permanently
            </DeleteButton>
          </DeleteAction>
        </DetailsWrapper>
      </GeneralPanel>
    </PanelStack>
  );
}
