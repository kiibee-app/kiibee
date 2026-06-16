"use client";

import GenericButton from "@/components/UI/GenericButton";
import GenericLoader from "@/components/UI/GenericLoader";
import SuccessArcIcon from "@/assets/icons/SuccessArcIcon";
import UploadAudioIcon from "@/assets/icons/UploadAudioIcon";
import UploadPdfIcon from "@/assets/icons/UploadPdfIcon";
import UploadEpubIcon from "@/assets/icons/UploadEpubIcon";
import {
  FileDetailsWrapper,
  PreviewFileRow,
  FileInfoColumn,
  PreviewBox,
  PreviewVideo,
  SelectedFileContainer,
} from "./styles";
import { formatFileSize } from "@/utils/file";
import { VARIANT } from "@/utils/Constants";
import { LOADER_SIZE, LOADER_VARIANT } from "@/utils/ui";
import COLORS from "@repo/ui/colors";
import { UploadHint } from "@/components/UI/ImageUploadCropModal/styles";
import { FORMAT_TYPE } from "@/utils/types";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";

type Props = {
  uploadType: string;
  selectedFile: File;
  previewUrl: string | null;
  isUploading: boolean;
  uploadComplete: boolean;
  canProceed: boolean;
  onNext: () => void;
};

export default function SelectedFileView({
  uploadType,
  selectedFile,
  previewUrl,
  isUploading,
  uploadComplete,
  canProceed,
  onNext,
}: Props) {
  const { t } = useTranslation();
  const renderPreview = () => {
    switch (uploadType) {
      case FORMAT_TYPE.VIDEO:
        return (
          <PreviewVideo
            src={previewUrl ?? ""}
            controls={false}
            preload="none"
          />
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
    <>
      <SelectedFileContainer>
        <UploadHint>
          {t("contents.contentUploadModal.upload")} {uploadType}
        </UploadHint>
        <FileDetailsWrapper>
          <PreviewFileRow>
            <PreviewBox>{renderPreview()}</PreviewBox>

            <FileInfoColumn>
              <MonoText $use="Body_Medium">{selectedFile.name}</MonoText>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
                {formatFileSize(selectedFile.size)}
              </MonoText>
            </FileInfoColumn>
          </PreviewFileRow>

          {uploadComplete && <SuccessArcIcon width={32} height={32} />}

          {isUploading && !uploadComplete && (
            <GenericLoader
              variant={LOADER_VARIANT.INLINE}
              size={LOADER_SIZE.MD}
            />
          )}
        </FileDetailsWrapper>

        <GenericButton
          variant={VARIANT.PRIMARY}
          minWidth="320px"
          disabled={!canProceed}
          onClick={onNext}
        >
          {t("contents.contentUploadModal.next")}
        </GenericButton>
      </SelectedFileContainer>
    </>
  );
}
