"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
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
  UploadHelperText,
  UploadHelperTextGroup,
  UploadModalContent,
} from "./styles";
import {
  CONTENT_UPLOAD_MODE,
  type ContentType,
  type ContentUploadMode,
} from "@/utils/content";
import { useContentUpload } from "@/hooks/contents/useContentUpload";
import SelectedFileView from "./SelectedFileView";
import ContentUploadDetails from "./UploadDetails";
import WebContentLinkForm from "./WebContentLinkForm";
import { FORMAT_TYPE } from "@/utils/types";
import { ADD_CONTENT_TABS, AddContentTab } from "@/utils/common";
import { API } from "@/lib/http/api/endpoints";
import { usePostAPI } from "@/lib/http/api/postApi";
import { axiosClient } from "@/lib/http/axiosClient";
import { CONTENT_TRANSLATION_KEYS } from "@/utils/contentApi";

type CreateContentPayload = {
  title: string;
  description: string;
  contentTypeId: ContentType;
  collectionId: string;
  fileKey?: string;
  contentUrl?: string;
};

export type MediaUrlResponse = {
  url?: string;
};

type UploadSuccessDetails = {
  title: string;
  description: string;
};

type PendingUploadSuccess = {
  tab: AddContentTab;
  file?: File | null;
  preview?: string | null;
  createdContentId?: string;
} & UploadSuccessDetails;

type ContentUploadModalProps = {
  visible: boolean;
  mode?: ContentUploadMode;
  contentId?: string | null;
  initialTitle?: string;
  initialDescription?: string;
  contentType: ContentType | null;
  collectionId?: string | null;
  onBack: () => void;
  onClose: () => void;
  onUploadSuccess?: (
    tab: AddContentTab,
    file?: File | null,
    preview?: string | null,
    createdContentId?: string,
    details?: UploadSuccessDetails,
  ) => void;
};

export default function ContentUploadModal({
  visible,
  mode = CONTENT_UPLOAD_MODE.CREATE,
  contentId,
  initialTitle = "",
  initialDescription = "",
  contentType,
  collectionId,
  onBack,
  onClose,
  onUploadSuccess,
}: ContentUploadModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState(false);
  const [webContentLink, setWebContentLink] = useState("");
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [pendingUploadSuccess, setPendingUploadSuccess] =
    useState<PendingUploadSuccess | null>(null);
  const createContentMutation = usePostAPI<unknown, CreateContentPayload>(
    API.content.create,
  );
  const isEditing = mode === CONTENT_UPLOAD_MODE.EDIT;
  const {
    fileInputRef,
    selectedFile,
    isUploading,
    uploadComplete,
    uploadError,
    uploadedFile,
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
    if (isSuccess && pendingUploadSuccess) {
      onUploadSuccess?.(
        pendingUploadSuccess.tab,
        pendingUploadSuccess.file,
        pendingUploadSuccess.preview,
        pendingUploadSuccess.createdContentId,
        {
          title: pendingUploadSuccess.title,
          description: pendingUploadSuccess.description,
        },
      );
    }

    reset();
    setWebContentLink("");
    setTitle("");
    setDescription("");
    setIsSuccess(false);
    setCreateError(null);
    setPendingUploadSuccess(null);
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
    setIsSuccess(false);
    setCreateError(null);
    setShowDetails(true);
    setTitle("");
    setDescription("");
  };

  const invalidateContentQueries = async () => {
    await Promise.all([
      collectionId
        ? queryClient.invalidateQueries({
            queryKey: [API.content.collection(collectionId)],
          })
        : Promise.resolve(),
      queryClient.invalidateQueries({ queryKey: [API.collection.getAll] }),
      contentId
        ? queryClient.invalidateQueries({
            queryKey: [API.content.get(contentId)],
          })
        : Promise.resolve(),
    ]);
  };

  const handleAdd = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (isEditing) {
      if (!trimmedTitle || !trimmedDescription || !contentId) return;

      setCreateError(null);

      try {
        await axiosClient.put(API.content.update(contentId), {
          title: trimmedTitle,
          description: trimmedDescription,
        });
        await invalidateContentQueries();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : t(CONTENT_TRANSLATION_KEYS.updateError);
        setCreateError(message);
        return;
      }

      setIsSuccess(true);
      return;
    }

    if (!trimmedTitle || !trimmedDescription || !contentType || !collectionId) {
      return;
    }

    const isWebContent = contentType === FORMAT_TYPE.WEB;
    const trimmedContentUrl = webContentLink.trim();
    const fileKey = uploadedFile?.key;

    if (isWebContent && !trimmedContentUrl) return;
    if (!isWebContent && !fileKey) return;

    const payload: CreateContentPayload = {
      title: trimmedTitle,
      description: trimmedDescription,
      contentTypeId: contentType,
      collectionId,
      ...(isWebContent ? { contentUrl: trimmedContentUrl } : { fileKey }),
    };

    setCreateError(null);

    try {
      const res = await createContentMutation.mutateAsync(payload);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [API.collection.getAll] }),
        queryClient.invalidateQueries({
          queryKey: [API.content.collection(collectionId)],
        }),
      ]);
      setIsSuccess(true);
      const createdId =
        (res as { data?: { id?: string } })?.data?.id ??
        (res as { id?: string })?.id;
      const uploadPreview =
        contentType === FORMAT_TYPE.VIDEO && fileKey
          ? (
              await axiosClient.get<MediaUrlResponse>(API.media.videoStream, {
                params: { key: fileKey },
              })
            ).data.url
          : previewUrl;
      setPendingUploadSuccess({
        tab: ADD_CONTENT_TABS.GENERAL,
        file: selectedFile,
        preview: uploadPreview ?? null,
        createdContentId: createdId,
        title: trimmedTitle,
        description: trimmedDescription,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("contents.contentUploadModal.createError");
      setCreateError(message);
      return;
    }
  };

  const handleResetDetails = () => {
    setIsSuccess(false);
    setShowDetails(true);
  };

  const getBackAction = () => {
    if (isSuccess) return () => handleResetDetails();
    if (isEditing) return () => handleExit(onBack);
    if (showDetails) return () => setShowDetails(false);
    return () => handleExit(onBack);
  };

  const handleBackClick = () => {
    const action = getBackAction();
    action();
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
        onClick={handleBackClick}
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
          {isEditing || showDetails ? (
            <ContentUploadDetails
              title={title}
              description={description}
              setTitle={handleChange(setTitle)}
              setDescription={handleChange(setDescription)}
              onAdd={handleAdd}
              submitLabel={t(
                isEditing
                  ? CONTENT_TRANSLATION_KEYS.updateAction
                  : CONTENT_TRANSLATION_KEYS.addAction,
              )}
              successMessage={
                isEditing
                  ? t(CONTENT_TRANSLATION_KEYS.editSuccess)
                  : `${t("contents.contentUploadModal.uploading")} ${
                      contentType ?? uploadType
                    }`
              }
              uploadType={contentType ?? uploadType}
              isSuccess={isSuccess}
              isSubmitting={createContentMutation.isPending}
              errorMessage={createError}
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
                {uploadError && (
                  <UploadHelperText>{uploadError}</UploadHelperText>
                )}
                <UploadHelperText>{helperLineOne}</UploadHelperText>
                {helperLineTwo && (
                  <UploadHelperText>{helperLineTwo}</UploadHelperText>
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
