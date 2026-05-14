"use client";

import { useCallback, useState } from "react";
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
  AddButtom,
} from "./styles";

import { formatFileSize } from "@/utils/file";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import { INPUT_TYPE, LOADER_SIZE, LOADER_VARIANT } from "@/utils/ui";
import COLORS from "@repo/ui/colors";
import { UploadHint } from "@/components/UI/ImageUploadCropModal/styles";
import InputField from "@/components/UI/InputFields";
import { CONTENTS } from "@/utils/translationKeys";
import { useTranslation } from "react-i18next";

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
  const [showDetails, setShowDetails] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleTitleChange = useCallback((value: string | string[]) => {
    const text = Array.isArray(value) ? value.join("") : value;
    setTitle(text.slice(0));
  }, []);

  const handleChange = useCallback((value: string | string[]) => {
    const text = Array.isArray(value) ? value.join("") : value;
    setDescription(text.slice(0));
  }, []);
  const handleNextClick = () => {
    if (!canProceed) return;
    setShowDetails(true);
  };

  const handleAdd = () => {
    if (!title.trim() || !description.trim()) return;
    onNext();
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
    <>
      {showDetails ? (
        <>
          <UploadHint>Add details</UploadHint>

          <InputField
            type={INPUT_TYPE.TEXT}
            value={title}
            placeholder="Enter title"
            width="100%"
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            onChange={handleTitleChange}
            label="Title"
          />
          <InputField
            type={INPUT_TYPE.TEXTAREA}
            value={description}
            placeholder={t(CONTENTS.appearance.description.placeholder)}
            width="100%"
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            onChange={handleChange}
            label="Description"
          />
          <AddButtom>
            <GenericButton
              variant={VARIANT.PRIMARY}
              minWidth="320px"
              onClick={handleAdd}
              disabled={!title.trim() || !description.trim()}
            >
              Add
            </GenericButton>
          </AddButtom>
        </>
      ) : (
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
            onClick={handleNextClick}
          >
            Next
          </GenericButton>
        </SelectedFileContainer>
      )}
    </>
  );
}
