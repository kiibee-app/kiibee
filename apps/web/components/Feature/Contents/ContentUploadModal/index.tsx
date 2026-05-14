"use client";

import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import SuccessArcIcon from "@/assets/icons/SuccessArcIcon";
import UploadAudioIcon from "@/assets/icons/UploadAudioIcon";
import UploadPdfIcon from "@/assets/icons/UploadPdfIcon";
import UploadEpubIcon from "@/assets/icons/UploadEpubIcon";
import GenericButton from "@/components/UI/GenericButton";
import { GenericModal } from "@/components/UI/Modals";
import GenericLoader from "@/components/UI/GenericLoader";
import {
  HiddenInput,
  UploadHint,
  UploadOrText,
} from "@/components/UI/ImageUploadCropModal/styles";
import { BackButton } from "../ContentTypeModal/styles";
import { VARIANT } from "@/utils/Constants";
import { LOADER_SIZE, LOADER_VARIANT } from "@/utils/ui";
import {
  ChooseUploadButton,
  ContentUploadDropZone,
  UploadBody,
  UploadHelperText,
  UploadHelperTextGroup,
  UploadModalContent,
  SelectedFileContainer,
  FileDetailsWrapper,
  PreviewFileRow,
  FileInfoColumn,
  PreviewBox,
  PreviewVideo,
} from "./styles";
import { ContentType } from "@/utils/content";
import { useContentUpload } from "@/hooks/contents/useContentUpload";
import { formatFileSize } from "@/utils/file";
import COLORS from "@repo/ui/colors";

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

  const {
    fileInputRef,
    selectedFile,
    isUploading,
    uploadComplete,
    previewUrl,
    uploadType,
    uploadConfig,
    canProceed,
    handleFileInputChange,
    handleDrop,
    reset,
  } = useContentUpload({ contentType });

  const helperLineOne = t(
    `contents.contentUploadModal.${uploadType}.helperLineOne`,
  );
  const helperLineTwo = t(
    `contents.contentUploadModal.${uploadType}.helperLineTwo`,
  );

  const handleExit = (callback: () => void) => {
    reset();
    callback();
  };

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
    <GenericModal
      visible={visible}
      onClose={() => handleExit(onClose)}
      width="670px"
      height="450px"
      padding="20px"
      borderRadius="20px"
    >
      <BackButton onClick={() => handleExit(onBack)}>
        <BackButtonIcon size={28} strokeWidth={2.5} />
      </BackButton>

      <UploadModalContent>
        <UploadBody>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept={uploadConfig.accept}
            onChange={handleFileInputChange}
          />

          {selectedFile ? (
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
              >
                {t("common.next", { defaultValue: "Next" })}
              </GenericButton>
            </SelectedFileContainer>
          ) : (
            <ContentUploadDropZone
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <UploadHint>
                {t("contents.contentUploadModal.dragFileHere")}
              </UploadHint>

              <UploadOrText>{t("contents.contentUploadModal.or")}</UploadOrText>

              <ChooseUploadButton>
                <GenericButton
                  variant={VARIANT.PRIMARY}
                  minWidth="182px"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t("contents.contentUploadModal.chooseFile")}
                </GenericButton>
              </ChooseUploadButton>

              <UploadHelperTextGroup>
                <UploadHelperText>{helperLineOne}</UploadHelperText>
                {helperLineTwo && (
                  <UploadHelperText>{helperLineTwo}</UploadHelperText>
                )}
              </UploadHelperTextGroup>
            </ContentUploadDropZone>
          )}
        </UploadBody>
      </UploadModalContent>
    </GenericModal>
  );
}
