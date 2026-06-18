"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import { CollectionContentRow, CollectionRow } from "@/types/collectionsType";
import { storage } from "@/utils/storage";
import {
  ContentType,
  getFileNameWithoutExtension,
  normalizeContentTypeValue,
} from "@/utils/content";
import { type ContentMediaUrlResponse } from "@/utils/contentApi";
import { useContentForm } from "@/components/Feature/Contents/ContentFormContext";
import { useAppearanceForm } from "@/components/Feature/Contents/Appearance/AppearanceFormContext";
import {
  AddContentTab,
  ADD_CONTENT_TABS,
  APPEARANCE,
  COLLECTIONS,
  SETTINGS,
  ContentTab,
  PAYMENT_DEFAULT_ACCESS_DURATION,
} from "@/utils/common";
import {
  AdmissionRequirementValue,
  ADMISSION_REQUIREMENT_VALUES,
} from "@/utils/admissionRequirements";
import { AccessDurationValue } from "@/utils/common";
import {
  ACCESS_TYPE_FREE,
  CONTENT_FORM_FIELDS,
  ERROR_MESSAGES,
  DOWNLOAD_LIMIT_DEFAULT,
  CONTENT_TYPE_FALLBACK,
  CONTENT_LAST_EDITED_STORAGE_KEY,
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
  GENERAL_FORM_FIELDS,
} from "@/utils/Constants";
import { resolveProfileAvatarUrl } from "@/utils/image";
import { FORMAT_TYPE, type FormatType } from "@/utils/types";
import { ADMISSION_TYPE } from "@/utils/paymentRequirements";
import type { ContentFormErrors } from "@/types/contentTypes";
import { defaultState } from "@/types/contentTypes";
import type { SaveContentSettingPayload } from "@/hooks/contents/useContentSettings";

type SettingsSnapshot = {
  accessType: AdmissionRequirementValue;
  passwords: string;
  description: string;
  rentalAmount: string;
  purchaseAmount: string;
  accessDuration: AccessDurationValue;
};

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
  contentSettingAccessType?: string;
  saveContentSetting?: (payload: SaveContentSettingPayload) => Promise<void>;
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
  contentSettingAccessType,
  saveContentSetting,
}: Params) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    formState,
    savedFormState,
    resetForm,
    setFormState,
    setSavedFormState,
    setFormErrors,
    clearFormErrors,
    markFormAsSaved,
  } = useContentForm();
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
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [collectionAccessType, setCollectionAccessType] =
    useState<AdmissionRequirementValue>(ADMISSION_REQUIREMENT_VALUES.free);
  const [collectionPasswords, setCollectionPasswords] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionRentalAmount, setCollectionRentalAmount] = useState("");
  const [collectionPurchaseAmount, setCollectionPurchaseAmount] = useState("");
  const [collectionAccessDuration, setCollectionAccessDuration] =
    useState<AccessDurationValue>(PAYMENT_DEFAULT_ACCESS_DURATION);
  const [savedSettings, setSavedSettings] = useState<SettingsSnapshot>({
    accessType: ADMISSION_REQUIREMENT_VALUES.free,
    passwords: "",
    description: "",
    rentalAmount: "",
    purchaseAmount: "",
    accessDuration: PAYMENT_DEFAULT_ACCESS_DURATION,
  });

  const [prevCollectionId, setPrevCollectionId] = useState<string | null>(null);

  const contentSettingToUiMap: Record<string, AdmissionRequirementValue> = {
    free: ADMISSION_REQUIREMENT_VALUES.free,
    set_password: ADMISSION_REQUIREMENT_VALUES.password,
    request_email: ADMISSION_REQUIREMENT_VALUES.email,
  };

  const buildSettingsSnapshot = (
    accessType: AdmissionRequirementValue,
    overrides?: Partial<SettingsSnapshot>,
  ): SettingsSnapshot => ({
    accessType,
    passwords: "",
    description: "",
    rentalAmount: "",
    purchaseAmount: "",
    accessDuration: PAYMENT_DEFAULT_ACCESS_DURATION,
    ...overrides,
  });

  const applySettingsSnapshot = (snapshot: SettingsSnapshot) => {
    setCollectionAccessType(snapshot.accessType);
    setCollectionPasswords(snapshot.passwords);
    setCollectionDescription(snapshot.description);
    setCollectionRentalAmount(snapshot.rentalAmount);
    setCollectionPurchaseAmount(snapshot.purchaseAmount);
    setCollectionAccessDuration(snapshot.accessDuration);
    setSavedSettings(snapshot);
  };

  if (selectedCollection && selectedCollection.id !== prevCollectionId) {
    setPrevCollectionId(selectedCollection.id);
    const apiAccessType = selectedCollection.accessType ?? ACCESS_TYPE_FREE;
    const uiAccessType =
      apiToUiAccessTypeMap[apiAccessType] || ADMISSION_REQUIREMENT_VALUES.free;
    applySettingsSnapshot(
      buildSettingsSnapshot(uiAccessType, {
        description: selectedCollection.description ?? "",
        rentalAmount:
          selectedCollection.rentPrice != null
            ? String(selectedCollection.rentPrice)
            : "",
        purchaseAmount:
          selectedCollection.buyPrice != null
            ? String(selectedCollection.buyPrice)
            : "",
        accessDuration:
          (selectedCollection.rentDuration as AccessDurationValue) ??
          PAYMENT_DEFAULT_ACCESS_DURATION,
      }),
    );
  } else if (!selectedCollection && prevCollectionId !== null) {
    setPrevCollectionId(null);
    const uiAccessType =
      contentSettingToUiMap[contentSettingAccessType ?? ""] ||
      ADMISSION_REQUIREMENT_VALUES.free;
    applySettingsSnapshot(buildSettingsSnapshot(uiAccessType));
  }

  const [contentSettingLoaded, setContentSettingLoaded] = useState(false);

  if (
    !selectedCollection &&
    contentSettingAccessType &&
    !contentSettingLoaded
  ) {
    const uiAccessType =
      contentSettingToUiMap[contentSettingAccessType] ||
      ADMISSION_REQUIREMENT_VALUES.free;
    applySettingsSnapshot(buildSettingsSnapshot(uiAccessType));
    setContentSettingLoaded(true);
  }
  const collectionId = selectedCollection?.id ?? null;
  const [syncedCollectionId, setSyncedCollectionId] = useState<string | null>(
    collectionId,
  );
  const [syncedSettingsKey, setSyncedSettingsKey] = useState(
    contentSettingAccessType ?? null,
  );

  if (selectedCollection) {
    if (collectionId !== syncedCollectionId) {
      setSyncedCollectionId(collectionId);
      setSyncedSettingsKey(null);

      const apiAccessType = selectedCollection.accessType ?? ACCESS_TYPE_FREE;
      const uiAccessType =
        apiToUiAccessTypeMap[apiAccessType] ||
        ADMISSION_REQUIREMENT_VALUES.free;
      setCollectionAccessType(uiAccessType);
      setCollectionPasswords("");
      setCollectionDescription(selectedCollection.description ?? "");
      setCollectionRentalAmount(
        selectedCollection.rentPrice != null
          ? String(selectedCollection.rentPrice)
          : "",
      );
      setCollectionPurchaseAmount(
        selectedCollection.buyPrice != null
          ? String(selectedCollection.buyPrice)
          : "",
      );
      setCollectionAccessDuration(
        (selectedCollection.rentDuration as AccessDurationValue) ??
          (PAYMENT_DEFAULT_ACCESS_DURATION as AccessDurationValue),
      );
    }
  } else {
    if (syncedCollectionId !== null) {
      setSyncedCollectionId(null);
      setSyncedSettingsKey(null);
    }

    const settingsKey = contentSettingAccessType ?? null;
    if (settingsKey && settingsKey !== syncedSettingsKey) {
      setSyncedSettingsKey(settingsKey);
      const uiAccessType =
        contentSettingToUiMap[settingsKey] || ADMISSION_REQUIREMENT_VALUES.free;
      setCollectionAccessType(uiAccessType);
    }
  }

  const handleUploadSuccess = (
    tab: AddContentTab,
    file?: File | null,
    preview?: string | null,
    createdContentId?: string,
    details?: { title: string; description: string },
  ) => {
    if (!createdContentId) {
      setActiveTabAndQuery(tab);
    }
    setUploadedFile(file ?? null);
    setUploadedPreview(preview ?? null);
    const prefilledState =
      file == null
        ? formState
        : {
            ...defaultState,
            title: getFileNameWithoutExtension(file.name),
          };
    const nextFormState = {
      ...prefilledState,
      title: details?.title ?? prefilledState.title,
      description: details?.description ?? prefilledState.description,
      contentTypeId:
        contentTypeFlow.selectedContentType ?? prefilledState.contentTypeId,
    };
    setFormState(nextFormState);
    setSavedFormState(nextFormState);
    if (createdContentId) {
      storage.set(CONTENT_LAST_EDITED_STORAGE_KEY, createdContentId);
      setEditingContent({
        id: createdContentId,
        name:
          details?.title ??
          (file ? getFileNameWithoutExtension(file.name) : ""),
        description: details?.description,
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

  const handleBackToBaseStateOnly = () => {
    if (isUploadMode) return resetUploadState();

    setSelectedCollection(null);
  };

  const handleSaveError = (error: unknown) => {
    const err = error as {
      status?: number;
      response?: { status?: number };
      message?: string;
    };
    if (err?.status === 413 || err?.response?.status === 413) {
      toast.error(t("errors.imageTooLarge"));
    } else {
      const message = err?.message;
      toast.error(
        (message ? t(message) : "") || t(ERROR_MESSAGES.SAVE_CHANGES_FAILED),
      );
    }
  };

  const validateMetadataForm = () => {
    const requiredMessage = t("contents.metadata.validation.required");
    const nextErrors: ContentFormErrors = {};

    if (!formState.title.trim()) {
      nextErrors[CONTENT_FORM_FIELDS.TITLE] = requiredMessage;
    }
    if (!formState.description.trim()) {
      nextErrors[CONTENT_FORM_FIELDS.DESCRIPTION] = requiredMessage;
    }
    if (!formState.publishedYear.trim()) {
      nextErrors[CONTENT_FORM_FIELDS.PUBLISHED_YEAR] = requiredMessage;
    }
    if (!formState.duration.trim()) {
      nextErrors[CONTENT_FORM_FIELDS.DURATION] = requiredMessage;
    }
    if (!formState.category.trim()) {
      nextErrors[CONTENT_FORM_FIELDS.CATEGORY] = requiredMessage;
    }
    if (!formState.productionCompany.trim()) {
      nextErrors[CONTENT_FORM_FIELDS.PRODUCTION_COMPANY] = requiredMessage;
    }
    if (!formState.manufacturerLink.trim()) {
      nextErrors[CONTENT_FORM_FIELDS.MANUFACTURER_LINK] = requiredMessage;
    }
    if (!formState.tags.trim()) {
      nextErrors[CONTENT_FORM_FIELDS.TAGS] = requiredMessage;
    }
    if (!formState.mediaCardThumbnail) {
      nextErrors.mediaCardThumbnail = t(
        "contents.metadata.validation.mediaCardThumbnail",
      );
    }
    if (!formState.portraitThumbnail) {
      nextErrors.portraitThumbnail = t(
        "contents.metadata.validation.portraitThumbnail",
      );
    }

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error(t("errors.metadataValidationFailed"));
      return false;
    }

    return true;
  };

  const saveUploadedContent = async () => {
    if (!editingContent?.id) {
      toast.error(t(ERROR_MESSAGES.NO_CONTENT));
      return;
    }

    if (activeTab === ADD_CONTENT_TABS.METADATA && !validateMetadataForm()) {
      return;
    }

    setIsSaving(true);
    try {
      clearFormErrors();
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
      markFormAsSaved(nextFormState);

      const payload = buildContentUpdatePayload(nextFormState);

      await axiosClient.put(API.content.update(editingContent.id), payload);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [API.content.get(editingContent.id)],
        }),
        selectedCollection?.id
          ? queryClient.invalidateQueries({
              queryKey: [API.content.collection(selectedCollection.id)],
            })
          : Promise.resolve(),
        queryClient.invalidateQueries({ queryKey: [API.collection.getAll] }),
      ]);

      toast.success(t("settings.notifications.successModal.message"));
      setShowSaveSuccessModal(true);
    } catch (error) {
      handleSaveError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveCollectionSettings = async () => {
    if (!selectedCollection) return;
    try {
      const apiAccessType =
        uiToApiAccessTypeMap[collectionAccessType] ?? ACCESS_TYPE_FREE;

      const hasRental =
        collectionAccessType === ADMISSION_REQUIREMENT_VALUES.payment &&
        collectionRentalAmount !== "";
      const hasPurchase =
        collectionAccessType === ADMISSION_REQUIREMENT_VALUES.payment &&
        collectionPurchaseAmount !== "";

      await axiosClient.patch(API.collection.update(selectedCollection.id), {
        accessType: apiAccessType,
        description: collectionDescription.trim(),
        rentPrice: hasRental ? parseFloat(collectionRentalAmount) : null,
        buyPrice: hasPurchase ? parseFloat(collectionPurchaseAmount) : null,
        rentDuration: hasRental ? collectionAccessDuration : null,
        password:
          collectionAccessType === ADMISSION_REQUIREMENT_VALUES.password &&
          collectionPasswords.trim()
            ? collectionPasswords.trim()
            : undefined,
      });

      const nextHasPassword =
        collectionAccessType === ADMISSION_REQUIREMENT_VALUES.password &&
        (Boolean(collectionPasswords.trim()) ||
          Boolean(selectedCollection.hasPassword));

      setCollections((prev) =>
        prev.map((c) =>
          c.id === selectedCollection.id
            ? {
                ...c,
                accessType: apiAccessType,
                description: collectionDescription.trim(),
                rentPrice: hasRental
                  ? parseFloat(collectionRentalAmount)
                  : null,
                buyPrice: hasPurchase
                  ? parseFloat(collectionPurchaseAmount)
                  : null,
                rentDuration: hasRental ? collectionAccessDuration : null,
                hasPassword: nextHasPassword,
              }
            : c,
        ),
      );

      const nextCollection = {
        ...selectedCollection,
        accessType: apiAccessType,
        description: collectionDescription.trim(),
        rentPrice: hasRental ? parseFloat(collectionRentalAmount) : null,
        buyPrice: hasPurchase ? parseFloat(collectionPurchaseAmount) : null,
        rentDuration: hasRental ? collectionAccessDuration : null,
        hasPassword: nextHasPassword,
      };

      setSelectedCollection(nextCollection);

      applySettingsSnapshot({
        accessType: collectionAccessType,
        passwords: "",
        description: collectionDescription.trim(),
        rentalAmount: hasRental ? collectionRentalAmount : "",
        purchaseAmount: hasPurchase ? collectionPurchaseAmount : "",
        accessDuration: hasRental
          ? collectionAccessDuration
          : PAYMENT_DEFAULT_ACCESS_DURATION,
      });

      await queryClient.invalidateQueries({
        queryKey: [API.collection.getAll],
      });
      setShowSaveSuccessModal(true);
    } catch {
      toast.error(t(ERROR_MESSAGES.SAVE_SETTINGS_FAILED));
    }
  };

  const uiToContentSettingMap: Record<string, string> = {
    [ADMISSION_REQUIREMENT_VALUES.free]: ADMISSION_TYPE.FREE,
    [ADMISSION_REQUIREMENT_VALUES.password]: ADMISSION_TYPE.SET_PASSWORD,
    [ADMISSION_REQUIREMENT_VALUES.email]: ADMISSION_TYPE.REQUEST_EMAIL,
  };

  const saveContentSettings = async () => {
    if (!saveContentSetting) return;
    try {
      const apiAccessType =
        uiToContentSettingMap[collectionAccessType] ?? ADMISSION_TYPE.FREE;
      const payload: SaveContentSettingPayload = { accessType: apiAccessType };

      if (
        collectionAccessType === ADMISSION_REQUIREMENT_VALUES.password &&
        collectionPasswords.trim()
      ) {
        payload.password = collectionPasswords.trim();
      }

      await saveContentSetting(payload);

      applySettingsSnapshot({
        accessType: collectionAccessType,
        passwords: "",
        description: "",
        rentalAmount: "",
        purchaseAmount: "",
        accessDuration: PAYMENT_DEFAULT_ACCESS_DURATION,
      });

      setShowSaveSuccessModal(true);
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
      } catch (error) {
        handleSaveError(error);
      }
    },
    [SETTINGS]: selectedCollection
      ? saveCollectionSettings
      : saveContentSettings,
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
    if (activeTab === SETTINGS) {
      applySettingsSnapshot(savedSettings);
      return;
    }
    openDiscardModal();
  };

  const hasGeneralUnsavedChanges = GENERAL_FORM_FIELDS.some(
    (field) => formState[field] !== savedFormState[field],
  );

  const hasMetadataUnsavedChanges =
    formState.title !== savedFormState.title ||
    formState.description !== savedFormState.description ||
    formState.publishedYear !== savedFormState.publishedYear ||
    formState.duration !== savedFormState.duration ||
    formState.category !== savedFormState.category ||
    formState.productionCompany !== savedFormState.productionCompany ||
    formState.manufacturerLink !== savedFormState.manufacturerLink ||
    formState.tags !== savedFormState.tags ||
    formState.mediaCardThumbnail !== savedFormState.mediaCardThumbnail ||
    formState.portraitThumbnail !== savedFormState.portraitThumbnail;

  const hasSettingsUnsavedChanges =
    collectionAccessType !== savedSettings.accessType ||
    collectionPasswords !== savedSettings.passwords ||
    collectionDescription !== savedSettings.description ||
    collectionRentalAmount !== savedSettings.rentalAmount ||
    collectionPurchaseAmount !== savedSettings.purchaseAmount ||
    collectionAccessDuration !== savedSettings.accessDuration;

  const closeContentUpload = () => {
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
    setIsEditingLoading(true);
    try {
      const item = collectionContents.find((content) => content.id === id);

      interface ContentDetailsResponse {
        title?: string;
        description?: string;
        contentType?: string;
        contentTypeId?: string;
        fileKey?: string | null;
        contentUrl?: string | null;
        trailerUrl?: string;
        visibility?: string;
        publishedYear?: number;
        duration?: number;
        categories?: { id: string }[];
        production_company?: string;
        manufacturerLink?: string;
        tags?: string[];
        thumbnailUrl?: string | null;
        thumbnailLandscapeUrl?: string | null;
        accessType?: string;
        rentPrice?: number;
        buyPrice?: number;
        maxDownloadCount?: number;
        physicalProductLink?: string;
        openInNewWindow?: boolean;
        openDirectFromList?: boolean;
      }

      const response = await axiosClient.get(API.content.get(id));
      const fullContent = (
        response as { data?: { data?: ContentDetailsResponse } }
      ).data?.data;
      if (fullContent) {
        const resolvedContentType = normalizeContentTypeValue(
          fullContent.contentTypeId ??
            fullContent.contentType ??
            item?.contentType ??
            CONTENT_TYPE_FALLBACK,
        );
        const resolvedName = item?.name || fullContent.title || "";

        setEditingContent({
          id,
          name: resolvedName,
          description: fullContent.description || item?.description,
          visibility: item?.visibility || VISIBILITY_PUBLIC_UPPER,
          createdAt: item?.createdAt || new Date().toISOString(),
          contentType: resolvedContentType,
          actions: item?.actions || "",
        });

        const mockFile = new File([], resolvedName, {
          type:
            contentTypeMimeMap[resolvedContentType] ??
            MIME_TYPE_APPLICATION_PDF,
        });
        const mockSize =
          contentTypeSizeMap[resolvedContentType] ?? mockSizeFallback;
        Object.defineProperty(mockFile, "size", { value: mockSize });

        setUploadedFile(mockFile);

        const getPreviewUrl = async (
          fileKey: string,
          contentType: FormatType,
        ): Promise<string | null> => {
          const endpoint =
            contentType === FORMAT_TYPE.VIDEO
              ? API.media.videoStream
              : API.media.fileSignedUrl;

          const res = await axiosClient.get<ContentMediaUrlResponse>(endpoint, {
            params: { key: fileKey },
          });

          return res.data.url || res.data.iframeUrl || null;
        };

        const preview = fullContent.fileKey
          ? await getPreviewUrl(fullContent.fileKey, resolvedContentType)
          : null;

        setUploadedPreview(preview ?? fullContent.contentUrl ?? null);

        const nextFormState = {
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
          tags: Array.isArray(fullContent.tags)
            ? fullContent.tags.join(", ")
            : "",
          mediaCardThumbnail: fullContent.thumbnailUrl || null,
          portraitThumbnail: fullContent.thumbnailLandscapeUrl || null,
          admissionRequirement:
            fullContent.accessType === "free"
              ? "free"
              : fullContent.accessType === "paid"
                ? "payment"
                : fullContent.accessType === "password"
                  ? "set_password"
                  : fullContent.accessType === "email_gated"
                    ? "request_email"
                    : "free",
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
          webLink: fullContent.contentUrl || "",
          openInNewWindow: fullContent.openInNewWindow ?? false,
          openDirectFromList: fullContent.openDirectFromList ?? false,
          contentTypeId: normalizeContentTypeValue(
            fullContent.contentTypeId ?? fullContent.contentType ?? "video",
          ),
        };

        setFormState(nextFormState);
        setSavedFormState(nextFormState);
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.LOAD_DETAILS_FAILED));
    } finally {
      setIsEditingLoading(false);
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
    isEditingLoading,
    isSaving,
    collectionAccessType,
    setCollectionAccessType,
    collectionPasswords,
    setCollectionPasswords,
    collectionDescription,
    setCollectionDescription,
    collectionRentalAmount,
    setCollectionRentalAmount,
    collectionPurchaseAmount,
    setCollectionPurchaseAmount,
    collectionAccessDuration,
    setCollectionAccessDuration,
    hasUnsavedChanges: hasAppearanceChanges,
    hasGeneralUnsavedChanges,
    hasMetadataUnsavedChanges,
    hasSettingsUnsavedChanges,
    handleUploadSuccess,
    handleBackToBase,
    handleBackToBaseStateOnly,
    resetUploadState,
    handleHeaderSave,
    handleHeaderCancel,
    handleEditContent,
    closeContentUpload,
    handleContentUploadBack,
  };
}
