"use client";

import { useState } from "react";
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
import { BUTTON, VARIANT } from "@/utils/Constants";
import {
  ChooseUploadButton,
  ContentUploadDropZone,
  UploadBody,
  UploadErrorText,
  UploadHelperText,
  UploadHelperTextGroup,
  UploadModalContent,
} from "./styles";
import { ContentType } from "@/utils/content";
import { useContentUpload } from "@/hooks/contents/useContentUpload";
import SelectedFileView from "./SelectedFileView";
import ContentUploadDetails from "./UploadDetails";
import WebContentLinkForm from "./WebContentLinkForm";
import { FORMAT_TYPE } from "@/utils/types";

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
  const [showDetails, setShowDetails] = useState(false);
  const [webContentLink, setWebContentLink] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const {
    fileInputRef,
    selectedFile,
    isUploading,
    uploadComplete,
    uploadError,
    uploadedMedia,
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
    setWebContentLink("");
    setShowDetails(false);
    callback();
  };

  const handleChange =
    (setter: (v: string) => void) => (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : value;
      setter(text);
    };

  const handleNextClick = () => {
    if (!canProceed) return;
    setShowDetails(true);
  };

  const handleWebNextClick = () => {
    if (!webContentLink.trim()) return;
    setShowDetails(true);
  };

  const handleAdd = () => {
    if (!title.trim() || !description.trim()) return;
    if (!isWebContent && !uploadedMedia?.key) return;
  };

  const isWebContent = contentType === FORMAT_TYPE.WEB;

  return (
    <GenericModal
      visible={visible}
      onClose={() => handleExit(onClose)}
      width="670px"
      height="450px"
      padding="20px"
      borderRadius="20px"
    >
      <BackButton
        type={BUTTON}
        aria-label={t("common.back")}
        onClick={() =>
          showDetails ? setShowDetails(false) : handleExit(onBack)
        }
      >
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
          {showDetails ? (
            <ContentUploadDetails
              title={title}
              description={description}
              setTitle={handleChange(setTitle)}
              setDescription={handleChange(setDescription)}
              onAdd={handleAdd}
            />
          ) : isWebContent ? (
            <WebContentLinkForm
              value={webContentLink}
              onChange={setWebContentLink}
              onNext={handleWebNextClick}
            />
          ) : !selectedFile ? (
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
                {uploadError && (
                  <UploadErrorText>{t(uploadError)}</UploadErrorText>
                )}
              </UploadHelperTextGroup>
            </ContentUploadDropZone>
          ) : (
            <SelectedFileView
              uploadType={uploadType}
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              isUploading={isUploading}
              uploadComplete={uploadComplete}
              canProceed={canProceed}
              onNext={handleNextClick}
            />
          )}
        </UploadBody>
      </UploadModalContent>
    </GenericModal>
  );
}
