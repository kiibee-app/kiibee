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
  const renderPreview = () => {
    switch (uploadType) {
      case "video":
        return <PreviewVideo src={previewUrl ?? ""} controls={false} />;
      case "audio":
        return (
          <UploadAudioIcon width={64} height={64} color={COLORS.primary.RED} />
        );
      case "pdf":
        return (
          <UploadPdfIcon width={64} height={64} color={COLORS.primary.RED} />
        );
      case "epub":
        return (
          <UploadEpubIcon width={64} height={64} color={COLORS.primary.BLUE} />
        );
      default:
        return null;
    }
  };

  return (
    <SelectedFileContainer>
      <UploadHint>Upload {uploadType}</UploadHint>
      <FileDetailsWrapper>
        <PreviewFileRow>
          <PreviewBox>{renderPreview()}</PreviewBox>

          <FileInfoColumn>
            <div>{selectedFile.name}</div>
            <div>{formatFileSize(selectedFile.size)}</div>
          </FileInfoColumn>
        </PreviewFileRow>

        {uploadComplete && <SuccessArcIcon width={32} height={32} />}

        {isUploading && !uploadComplete && (
          <GenericLoader
            variant={LOADER_VARIANT.INLINE}
            size={LOADER_SIZE.SM}
          />
        )}
      </FileDetailsWrapper>

      <GenericButton
        variant={VARIANT.PRIMARY}
        minWidth="320px"
        disabled={!canProceed}
        onClick={onNext}
      >
        Next
      </GenericButton>
    </SelectedFileContainer>
  );
}
