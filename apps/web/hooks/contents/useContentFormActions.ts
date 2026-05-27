"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import { CollectionContentRow, CollectionRow } from "@/types/collectionsType";
import { ContentType, getFileNameWithoutExtension } from "@/utils/content";
import { useContentForm } from "@/components/Feature/Contents/ContentFormContext";
import { useAppearanceForm } from "@/components/Feature/Contents/Appearance/AppearanceFormContext";
import {
  AddContentTab,
  ADD_CONTENT_TABS,
  APPEARANCE,
  COLLECTIONS,
  SETTINGS,
  ContentTab,
} from "@/utils/common";
import {
  AdmissionRequirementValue,
  ADMISSION_REQUIREMENT_VALUES,
} from "@/utils/admissionRequirements";
import {
  ACCESS_TYPE_FREE,
  ADMISSION_REQUIREMENT_PAYMENT,
  ADMISSION_REQUIREMENT_FREE,
  ERROR_MESSAGES,
  DOWNLOAD_LIMIT_DEFAULT,
  CONTENT_TYPE_FALLBACK,
  VISIBILITY_PUBLIC_UPPER,
  VISIBILITY_PUBLIC_LOWER,
  CATEGORY_EDUCATION_LOWER,
  MIME_TYPE_APPLICATION_PDF,
  apiToUiAccessTypeMap,
  uiToApiAccessTypeMap,
  contentTypeMimeMap,
  contentTypeSizeMap,
  mockSizeFallback,
  buildContentUpdatePayload,
} from "@/utils/Constants";
import { resolveProfileAvatarUrl } from "@/utils/image";

type Params = {
  activeTab: ContentTab;
  isUploadMode: boolean;
  selectedCollection: CollectionRow | null;
  setSelectedCollection: Dispatch<SetStateAction<CollectionRow | null>>;
  setCollections: Dispatch<SetStateAction<CollectionRow[]>>;
  collectionContents: CollectionContentRow[];
  setActiveTabAndQuery: (tab: ContentTab) => void;
  openDiscardModal: () => void;
  createCollectionFlow: { openSuccess: () => void };
  contentTypeFlow: {
    selectedContentType: ContentType | null;
    close: () => void;
    backToTypeSelect: () => void;
  };
};

export function useContentFormActions({
  activeTab,
  isUploadMode,
  selectedCollection,
  setSelectedCollection,
  setCollections,
  collectionContents,
  setActiveTabAndQuery,
  openDiscardModal,
  createCollectionFlow,
  contentTypeFlow,
}: Params) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { formState, prefillForm, resetForm, setFormState } = useContentForm();
  const {
    hasUnsavedChanges: hasAppearanceChanges,
    saveAppearance,
    cancelAppearance,
  } = useAppearanceForm();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [editingContent, setEditingContent] =
    useState<CollectionContentRow | null>(null);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);

  const [collectionAccessType, setCollectionAccessType] =
    useState<AdmissionRequirementValue>(ADMISSION_REQUIREMENT_VALUES.free);
  const [collectionPasswords, setCollectionPasswords] = useState("");

  const [prevCollectionId, setPrevCollectionId] = useState<string | null>(null);

  if (selectedCollection && selectedCollection.id !== prevCollectionId) {
    setPrevCollectionId(selectedCollection.id);
    const apiAccessType = selectedCollection.accessType ?? ACCESS_TYPE_FREE;
    const uiAccessType =
      apiToUiAccessTypeMap[apiAccessType] || ADMISSION_REQUIREMENT_VALUES.free;
    setCollectionAccessType(uiAccessType);
    setCollectionPasswords("");
  } else if (!selectedCollection && prevCollectionId !== null) {
    setPrevCollectionId(null);
  }

  const handleUploadSuccess = (
    tab: AddContentTab,
    file?: File | null,
    preview?: string | null,
    createdContentId?: string,
  ) => {
    setActiveTabAndQuery(tab);
    setUploadedFile(file ?? null);
    setUploadedPreview(preview ?? null);
    prefillForm(file ?? null);
    if (createdContentId) {
      setEditingContent({
        id: createdContentId,
        name: file ? getFileNameWithoutExtension(file.name) : "",
        contentType:
          contentTypeFlow.selectedContentType ??
          (CONTENT_TYPE_FALLBACK as ContentType),
        visibility: VISIBILITY_PUBLIC_UPPER,
        createdAt: new Date().toISOString(),
        actions: "",
      });
    }
  };

  const resetUploadState = () => {
    setUploadedFile(null);
    setUploadedPreview(null);
    setEditingContent(null);
    resetForm();
  };

  const handleBackToBase = () => {
    if (isUploadMode) {
      resetUploadState();
    } else {
      setSelectedCollection(null);
    }
    setActiveTabAndQuery(COLLECTIONS);
  };

  const saveUploadedContent = async () => {
    if (!editingContent?.id) {
      toast.error(t(ERROR_MESSAGES.NO_CONTENT));
      return;
    }

    try {
      const [thumbnailUrl, thumbnailLandscapeUrl] = await Promise.all([
        resolveProfileAvatarUrl(formState.mediaCardThumbnail),
        resolveProfileAvatarUrl(formState.portraitThumbnail),
      ]);

      const nextFormState = {
        ...formState,
        mediaCardThumbnail: thumbnailUrl,
        portraitThumbnail: thumbnailLandscapeUrl,
      };

      setFormState(nextFormState);

      const payload = buildContentUpdatePayload(nextFormState);

      await axiosClient.put(API.content.update(editingContent.id), payload);

      await Promise.all([
        selectedCollection?.id
          ? queryClient.invalidateQueries({
              queryKey: [API.content.collection(selectedCollection.id)],
            })
          : Promise.resolve(),
        queryClient.invalidateQueries({ queryKey: [API.collection.getAll] }),
      ]);

      setShowSaveSuccessModal(true);
    } catch {
      toast.error(t(ERROR_MESSAGES.SAVE_CHANGES_FAILED));
    }
  };

  const saveCollectionSettings = async () => {
    if (!selectedCollection) return;
    try {
      const apiAccessType =
        uiToApiAccessTypeMap[collectionAccessType] ?? ACCESS_TYPE_FREE;

      await axiosClient.patch(API.collection.update(selectedCollection.id), {
        accessType: apiAccessType,
      });

      setCollections((prev) =>
        prev.map((c) =>
          c.id === selectedCollection.id
            ? { ...c, accessType: apiAccessType }
            : c,
        ),
      );

      setSelectedCollection({
        ...selectedCollection,
        accessType: apiAccessType,
      });

      await queryClient.invalidateQueries({
        queryKey: [API.collection.getAll],
      });
      toast.success(t("contents.createCollectionSuccessModal.message"));
    } catch {
      toast.error(t(ERROR_MESSAGES.SAVE_SETTINGS_FAILED));
    }
  };

  const saveActionsMap: Record<string, () => Promise<void> | void> = {
    [APPEARANCE]: async () => {
      if (!hasAppearanceChanges) return;
      try {
        await saveAppearance();
        setShowSaveSuccessModal(true);
      } catch {
        toast.error(t(ERROR_MESSAGES.SAVE_CHANGES_FAILED));
      }
    },
    [SETTINGS]: saveCollectionSettings,
    [ADD_CONTENT_TABS.GENERAL]: saveUploadedContent,
    [ADD_CONTENT_TABS.METADATA]: saveUploadedContent,
    [ADD_CONTENT_TABS.PAYMENT]: saveUploadedContent,
  };

  const handleHeaderSave = async () => {
    const handler = saveActionsMap[activeTab];
    if (handler) {
      await handler();
    } else {
      createCollectionFlow.openSuccess();
    }
  };

  const handleHeaderCancel = () => {
    if (activeTab === APPEARANCE) {
      cancelAppearance();
      return;
    }
    openDiscardModal();
  };

  const closeContentUpload = () => {
    setEditingContent(null);
    contentTypeFlow.close();
  };

  const handleContentUploadBack = () => {
    if (editingContent) {
      closeContentUpload();
      return;
    }
    contentTypeFlow.backToTypeSelect();
  };

  const handleEditContent = async (id: string) => {
    const item = collectionContents.find((content) => content.id === id);
    if (!item) return;

    interface ContentDetailsResponse {
      title?: string;
      description?: string;
      trailerUrl?: string;
      visibility?: string;
      publishedYear?: number;
      duration?: number;
      categories?: { id: string }[];
      production_company?: string;
      manufacturerLink?: string;
      thumbnailUrl?: string | null;
      thumbnailLandscapeUrl?: string | null;
      accessType?: string;
      rentPrice?: number;
      buyPrice?: number;
      maxDownloadCount?: number;
      physicalProductLink?: string;
    }

    try {
      const response = await axiosClient.get(API.content.get(id));
      const fullContent = (
        response as { data?: { data?: ContentDetailsResponse } }
      ).data?.data;
      if (fullContent) {
        setEditingContent(item);

        const mockFile = new File([], item.name, {
          type:
            contentTypeMimeMap[item.contentType] ?? MIME_TYPE_APPLICATION_PDF,
        });
        const mockSize =
          contentTypeSizeMap[item.contentType] ?? mockSizeFallback;
        Object.defineProperty(mockFile, "size", { value: mockSize });

        setUploadedFile(mockFile);
        setUploadedPreview(null);

        setFormState({
          title: fullContent.title || "",
          description: fullContent.description || "",
          trailerLink: fullContent.trailerUrl || "",
          visibility: fullContent.visibility || VISIBILITY_PUBLIC_LOWER,
          publishedYear: fullContent.publishedYear
            ? String(fullContent.publishedYear)
            : "",
          duration: fullContent.duration ? String(fullContent.duration) : "",
          category: fullContent.categories?.[0]?.id || CATEGORY_EDUCATION_LOWER,
          productionCompany: fullContent.production_company || "",
          manufacturerLink: fullContent.manufacturerLink || "",
          tags: "",
          mediaCardThumbnail: fullContent.thumbnailUrl || null,
          portraitThumbnail: fullContent.thumbnailLandscapeUrl || null,
          admissionRequirement:
            fullContent.accessType === ACCESS_TYPE_FREE
              ? ADMISSION_REQUIREMENT_FREE
              : ADMISSION_REQUIREMENT_PAYMENT,
          rentalAmount: fullContent.rentPrice
            ? String(fullContent.rentPrice)
            : "",
          purchaseAmount: fullContent.buyPrice
            ? String(fullContent.buyPrice)
            : "",
          maxDownloadLimit: fullContent.maxDownloadCount
            ? String(fullContent.maxDownloadCount)
            : DOWNLOAD_LIMIT_DEFAULT,
          physicalProductLink: fullContent.physicalProductLink || "",
        });

        setActiveTabAndQuery(ADD_CONTENT_TABS.GENERAL);
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.LOAD_DETAILS_FAILED));
    }
  };

  return {
    uploadedFile,
    setUploadedFile,
    uploadedPreview,
    setUploadedPreview,
    editingContent,
    setEditingContent,
    showSaveSuccessModal,
    setShowSaveSuccessModal,
    collectionAccessType,
    setCollectionAccessType,
    collectionPasswords,
    setCollectionPasswords,
    hasUnsavedChanges: hasAppearanceChanges,
    handleUploadSuccess,
    handleBackToBase,
    handleHeaderSave,
    handleHeaderCancel,
    handleEditContent,
    closeContentUpload,
    handleContentUploadBack,
  };
}
