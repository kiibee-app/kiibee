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
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";

type Props = {
  uploadedFile?: File | null;
  uploadedPreview?: string | null;
  uploadedFileSnapshot?: {
    name: string;
    size: number;
    type: string;
  } | null;
  contentId?: string | null;
};

export default function GeneralContent({
  uploadedPreview,
  uploadedFile,
  uploadedFileSnapshot,
  contentId,
}: Props) {
  const { t } = useTranslation();
  const { data: contentResponse } = useGetAPI<Record<string, unknown>>(
    API.content.get(contentId ?? ""),
    undefined,
    { enabled: Boolean(contentId) },
  );

  const apiContentData =
    contentResponse &&
    typeof contentResponse === "object" &&
    "data" in contentResponse &&
    contentResponse.data &&
    typeof contentResponse.data === "object"
      ? (contentResponse.data as Record<string, unknown>)
      : contentResponse;

  const apiFileKey =
    apiContentData &&
    typeof apiContentData === "object" &&
    typeof apiContentData.fileKey === "string"
      ? apiContentData.fileKey
      : "";
  const apiNameFromFileKey = apiFileKey.split("/").pop() || "";
  const apiTitle =
    apiContentData &&
    typeof apiContentData === "object" &&
    typeof apiContentData.title === "string"
      ? apiContentData.title
      : "";
  const apiFileSize =
    apiContentData &&
    typeof apiContentData === "object" &&
    typeof apiContentData.fileSize === "number"
      ? apiContentData.fileSize
      : 0;

  const inferMimeTypeFromName = (name: string) => {
    const lowered = name.toLowerCase();
    if (lowered.endsWith(".mp4")) return "video/mp4";
    if (lowered.endsWith(".mp3")) return "audio/mpeg";
    if (lowered.endsWith(".wav")) return "audio/wav";
    if (lowered.endsWith(".ogg")) return "audio/ogg";
    if (lowered.endsWith(".pdf")) return "application/pdf";
    if (lowered.endsWith(".epub")) return "application/epub+zip";
    return "";
  };

  const apiDisplayFile =
    apiNameFromFileKey || apiTitle
      ? {
          name: apiNameFromFileKey || apiTitle,
          size: apiFileSize,
          type: inferMimeTypeFromName(apiNameFromFileKey || apiTitle),
        }
      : null;

  const displayFile = uploadedFile ?? apiDisplayFile ?? uploadedFileSnapshot;
  if (!displayFile) return null;

  const getFormatType = (file: Pick<File, "name" | "type">): FormatType => {
    const match = Object.entries(FILE_TYPE_CHECKERS).find(([, check]) =>
      check(file as File),
    );
    return (match?.[0] as FormatType) ?? FORMAT_TYPE.PDF;
  };

  const uploadType = getFormatType(displayFile);
  const previewUrl = uploadedPreview;

  const renderPreview = () => {
    switch (uploadType) {
      case FORMAT_TYPE.VIDEO:
        return (
          <PreviewBox>
            {previewUrl ? (
              <PreviewVideo src={previewUrl} controls={false} />
            ) : null}
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
              <MonoText $use="Body_Medium">{displayFile.name}</MonoText>

              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
                {formatFileSize(displayFile.size)}
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
      <TrailerList />
    </PanelStack>
  );
}
