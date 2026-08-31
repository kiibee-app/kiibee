import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CollectionRow, INITIAL_COUPON_FORM } from "@/types/collectionsType";
import {
  COLLECTIONS,
  COUPON_DISCOUNT_FIXED_AMOUNT,
  COUPONS,
  ContentTab,
  COUPON_DISCOUNT_TYPE,
  QUERY_REFETCH_TYPE_ACTIVE,
} from "@/utils/common";
import { type CreateCouponPayload } from "@/types/couponType";
import { API } from "@/lib/http/api/endpoints";
import { usePostAPI } from "@/lib/http/api/postApi";
import { axiosClient } from "@/lib/http/axiosClient";
import {
  COUPON_STEPS,
  CouponStep,
  isUploadContentType,
  STEP_ORDER,
  type ContentType,
} from "@/utils/content";
import { FORMAT_TYPE } from "@/utils/types";
import { COLLECTION, CONTENT } from "@/utils/ui";
import {
  findSingleContentCollection,
  getCollectionApiErrorMessage,
  isCollectionNameExistsError,
  UPLOAD_KIND,
  type UploadKind,
} from "@/utils/collection";
import { toValidFrom, toValidUntil } from "@/utils/couponDates";
import { getCouponErrorMessage } from "@/utils/couponErrors";
import { ERROR_MESSAGES } from "@/utils/Constants";
import { CONTENTS } from "@/utils/translationKeys";

type CreatedCollectionResponse = {
  id?: string;
  name?: string;
  data?: { id?: string; name?: string };
};

const mapCreatedCollection = (
  createdRes: CreatedCollectionResponse,
  fallbackName: string,
): CollectionRow | null => {
  const createdData = createdRes?.data || createdRes;
  const createdId = createdData?.id;
  if (!createdId) return null;

  return {
    id: createdId,
    name: createdData?.name || fallbackName,
    contentsCount: 0,
    createdAt: new Date().toISOString(),
    actions: "",
  };
};

export const useContentsModalFlows = (
  activeTab: ContentTab,
  collections: CollectionRow[],
  isCollectionContentMode: boolean,
  setCollections: Dispatch<SetStateAction<CollectionRow[]>>,
  resetAfterRefetch: () => void,
  setSelectedCollection: (collection: CollectionRow | null) => void,
  collectionsReady: boolean,
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [couponForm, setCouponForm] = useState(INITIAL_COUPON_FORM);
  const [couponInitialForm, setCouponInitialForm] =
    useState(INITIAL_COUPON_FORM);
  const [isCouponDiscardPending, setIsCouponDiscardPending] = useState(false);
  const [isCouponSuccess, setIsCouponSuccess] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUploadKindModal, setShowUploadKindModal] = useState(false);
  const [contentTypeFromUploadKind, setContentTypeFromUploadKind] =
    useState(false);
  const contentTypeFromUploadKindRef = useRef(false);

  const setFromUploadKind = (value: boolean) => {
    contentTypeFromUploadKindRef.current = value;
    setContentTypeFromUploadKind(value);
  };
  const [showContentTypeModal, setShowContentTypeModal] = useState(false);
  const [showContentUploadModal, setShowContentUploadModal] = useState(false);
  const [selectedContentType, setSelectedContentType] =
    useState<ContentType | null>(null);
  const [collectionName, setCollectionName] = useState("");
  const [couponStep, setCouponStep] = useState<CouponStep | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(
    null,
  );
  const createCouponMutation = usePostAPI<unknown, CreateCouponPayload>(
    API.coupon.create,
  );
  const createCollectionMutation = usePostAPI<unknown, { name: string }>(
    API.collection.create,
  );
  const normalizeCouponForm = (form: typeof INITIAL_COUPON_FORM) => ({
    ...form,
    title: form.title.trim(),
    discountValue: form.discountValue.trim(),
    codes: (form.codes ?? []).map((code) => code.trim()).filter(Boolean),
    collectionIds: form.collectionIds ?? [],
    contentIds: form.contentIds ?? [],
    startDate: form.startDate?.trim() ?? "",
    endDate: form.endDate?.trim() ?? "",
  });

  const hasCouponChanges =
    JSON.stringify(normalizeCouponForm(couponForm)) !==
    JSON.stringify(normalizeCouponForm(couponInitialForm));

  const couponFlow = {
    open: () => {
      setCouponInitialForm(INITIAL_COUPON_FORM);
      setCouponStep(COUPON_STEPS.DETAILS);
    },
    close: () => setCouponStep(null),
    next: () =>
      setCouponStep((current) => {
        if (!current) return STEP_ORDER[0];
        const i = STEP_ORDER.indexOf(current);
        return STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)];
      }),
    back: () =>
      setCouponStep((current) => {
        if (!current) return null;
        const i = STEP_ORDER.indexOf(current);
        if (i <= 0) return STEP_ORDER[0];
        return STEP_ORDER[i - 1];
      }),
    isOpen: {
      details: couponStep === COUPON_STEPS.DETAILS,
      codes: couponStep === COUPON_STEPS.CODES,
      applicableProducts: couponStep === COUPON_STEPS.APPLICABLE_PRODUCTS,
      validity: couponStep === COUPON_STEPS.VALIDITY,
      preview: couponStep === COUPON_STEPS.PREVIEW,
    },
  };

  const resetCreateFlow = () => {
    setShowCreateModal(false);
    setCollectionName("");
    setEditingCollectionId(null);
    setShowSuccessModal(true);
  };

  const createCollectionFlow = {
    collectionName,
    setCollectionName,
    showCreateModal,
    showSuccessModal,

    editingCollectionId,

    openCreate: (name?: string, id?: string) => {
      if (name) setCollectionName(name);
      if (id) setEditingCollectionId(id);
      setShowCreateModal(true);
    },

    closeCreate: () => {
      setShowCreateModal(false);
      setCollectionName("");
      setEditingCollectionId(null);
    },
    completeCreate: async () => {
      const trimmedName = collectionName.trim();
      if (!trimmedName) return;

      try {
        if (editingCollectionId) {
          await axiosClient.patch(API.collection.update(editingCollectionId), {
            name: trimmedName,
          });
          setCollections((prev) =>
            prev.map((item) =>
              item.id === editingCollectionId
                ? { ...item, name: trimmedName }
                : item,
            ),
          );
          await queryClient.invalidateQueries({
            queryKey: [API.collection.getAll],
          });
          await queryClient.refetchQueries({
            queryKey: [API.collection.getAll],
            type: QUERY_REFETCH_TYPE_ACTIVE,
          });
          resetAfterRefetch();
          resetCreateFlow();
          return;
        }

        const createdRes = (await createCollectionMutation.mutateAsync({
          name: trimmedName,
        })) as CreatedCollectionResponse;

        const createdCollection = mapCreatedCollection(createdRes, trimmedName);

        if (createdCollection) {
          setCollections((prev) => [...prev, createdCollection]);
        }

        await queryClient.invalidateQueries({
          queryKey: [API.collection.getAll],
        });
        await queryClient.refetchQueries({
          queryKey: [API.collection.getAll],
          type: QUERY_REFETCH_TYPE_ACTIVE,
        });
        resetAfterRefetch();
        resetCreateFlow();
      } catch (error) {
        toast.error(
          getCollectionApiErrorMessage(error) ||
            t(ERROR_MESSAGES.SAVE_COLLECTION_FAILED),
        );
      }
    },
    closeSuccess: () => setShowSuccessModal(false),
    openSuccess: () => setShowSuccessModal(true),
  };

  const collectionsRef = useRef(collections);
  collectionsRef.current = collections;
  const ensureSingleContentStartedRef = useRef(false);

  const refreshCollections = async () => {
    await queryClient.invalidateQueries({
      queryKey: [API.collection.getAll],
    });
    await queryClient.refetchQueries({
      queryKey: [API.collection.getAll],
      type: QUERY_REFETCH_TYPE_ACTIVE,
    });
    resetAfterRefetch();
  };

  const ensureSingleContentCollection = async (
    options: { silent?: boolean } = {},
  ): Promise<CollectionRow | null> => {
    const localizedName = t(CONTENTS.singleContentCollection.name);
    const existing = findSingleContentCollection(
      collectionsRef.current,
      localizedName,
    );
    if (existing) {
      return existing;
    }

    try {
      const createdRes = (await createCollectionMutation.mutateAsync({
        name: localizedName,
      })) as CreatedCollectionResponse;
      const createdCollection = mapCreatedCollection(createdRes, localizedName);

      if (createdCollection) {
        setCollections((prev) => {
          if (prev.some((item) => item.id === createdCollection.id)) {
            return prev;
          }
          return [...prev, createdCollection];
        });
        collectionsRef.current = [
          ...collectionsRef.current.filter(
            (item) => item.id !== createdCollection.id,
          ),
          createdCollection,
        ];
      }

      await refreshCollections();
      return (
        findSingleContentCollection(collectionsRef.current, localizedName) ??
        createdCollection
      );
    } catch (error) {
      const apiError = getCollectionApiErrorMessage(error);
      if (isCollectionNameExistsError(apiError)) {
        await refreshCollections();
        return (
          findSingleContentCollection(collectionsRef.current, localizedName) ??
          null
        );
      }

      if (!options.silent) {
        toast.error(apiError || t(ERROR_MESSAGES.SAVE_COLLECTION_FAILED));
      }
      return null;
    }
  };

  useEffect(() => {
    if (!collectionsReady || ensureSingleContentStartedRef.current) {
      return;
    }

    ensureSingleContentStartedRef.current = true;
    void ensureSingleContentCollection({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionsReady]);

  const exitSingleContentUploadSelection = () => {
    if (contentTypeFromUploadKindRef.current) {
      setSelectedCollection(null);
      setFromUploadKind(false);
    }
  };

  const contentTypeFlow = {
    showContentTypeModal,
    showContentUploadModal,
    selectedContentType,
    fromUploadKind: contentTypeFromUploadKind,
    open: () => setShowContentTypeModal(true),
    commitUploadKind: () => setFromUploadKind(false),
    close: () => {
      setShowContentTypeModal(false);
      setShowContentUploadModal(false);
      setSelectedContentType(null);
      exitSingleContentUploadSelection();
    },
    backToTypeSelect: () => {
      setShowContentUploadModal(false);
      setShowContentTypeModal(true);
    },
    backFromTypeSelect: () => {
      setShowContentTypeModal(false);
      setSelectedContentType(null);
      if (contentTypeFromUploadKindRef.current) {
        setSelectedCollection(null);
        setFromUploadKind(false);
        setShowUploadKindModal(true);
        return;
      }
    },
    continueWithType: (contentType: ContentType) => {
      setSelectedContentType(contentType);
      setShowContentTypeModal(false);
      if (isUploadContentType(contentType) || contentType === FORMAT_TYPE.WEB) {
        setShowContentUploadModal(true);
        return;
      }

      setShowContentUploadModal(false);
    },
    openEdit: (contentType: ContentType) => {
      setSelectedContentType(contentType);
      setShowContentTypeModal(false);
      setShowContentUploadModal(true);
    },
  };

  const closeCouponFlow = () => {
    setCouponForm(INITIAL_COUPON_FORM);
    setCouponInitialForm(INITIAL_COUPON_FORM);
    setIsCouponSuccess(false);
    setEditingCouponId(null);
    setIsCouponDiscardPending(false);
    couponFlow.close();
  };

  const requestCloseCouponFlow = () => {
    if (!isCouponSuccess && hasCouponChanges) {
      setIsCouponDiscardPending(true);
      setShowDiscardModal(true);
      return;
    }

    closeCouponFlow();
  };

  const handleBackFromCouponPreview = () => {
    if (isCouponSuccess) {
      setIsCouponSuccess(false);
      return;
    }
    setIsCouponSuccess(false);
    couponFlow.back();
  };

  const handleCouponSubmit = async () => {
    const codes = (couponForm.codes ?? [])
      .map((code) => code.trim())
      .filter((code) => code.length > 0);

    const normalizedCollectionIds = (couponForm.collectionIds ?? [])
      .map((id) => id.trim())
      .filter((id) => id.length > 0 && !id.startsWith(COLLECTION));
    const normalizedContentIds = (couponForm.contentIds ?? [])
      .map((id) => id.trim())
      .filter((id) => id.length > 0 && !id.startsWith(CONTENT));

    const payload = {
      title: couponForm.title.trim(),
      discountType:
        couponForm.discountType === COUPON_DISCOUNT_FIXED_AMOUNT
          ? couponForm.discountType
          : COUPON_DISCOUNT_TYPE.PERCENTAGE,
      discountValue: couponForm.discountValue.trim(),
      codes,
      collectionIds:
        normalizedCollectionIds.length > 0
          ? normalizedCollectionIds
          : undefined,
      contentIds:
        normalizedContentIds.length > 0 ? normalizedContentIds : undefined,
      validFrom: toValidFrom(couponForm.startDate),
      validUntil: toValidUntil(couponForm.endDate),
    };

    try {
      const submitRequest = editingCouponId
        ? axiosClient.patch(API.coupon.update(editingCouponId), payload)
        : createCouponMutation.mutateAsync(payload);

      await submitRequest;

      await queryClient.invalidateQueries({ queryKey: [API.coupon.getAll] });
      setIsCouponSuccess(true);
    } catch (error) {
      toast.error(getCouponErrorMessage(error, t));
    }
  };

  const uploadKindFlow = {
    showUploadKindModal,
    open: () => setShowUploadKindModal(true),
    close: () => setShowUploadKindModal(false),
    continueWithKind: async (kind: UploadKind) => {
      setShowUploadKindModal(false);
      if (kind === UPLOAD_KIND.COLLECTION) {
        createCollectionFlow.openCreate();
        return;
      }

      const singleContentCollection = await ensureSingleContentCollection();
      if (!singleContentCollection) {
        setShowUploadKindModal(true);
        return;
      }

      setSelectedCollection(singleContentCollection);
      setFromUploadKind(true);
      contentTypeFlow.open();
    },
  };

  const handleCreateClick = () => {
    if (activeTab === COUPONS) {
      couponFlow.open();
      return;
    }
    if (activeTab === COLLECTIONS) {
      if (isCollectionContentMode) {
        setFromUploadKind(false);
        contentTypeFlow.open();
        return;
      }
      uploadKindFlow.open();
    }
  };
  const handleEditCollection = (id: string) => {
    const item = collections.find((c) => c.id === id);
    if (!item) return;

    createCollectionFlow.openCreate(item.name, id);
  };

  const openCouponEdit = (
    couponId: string,
    formState: typeof INITIAL_COUPON_FORM,
  ) => {
    setEditingCouponId(couponId);
    setCouponForm(formState);
    setCouponInitialForm(formState);
    setIsCouponSuccess(false);
    setCouponStep(COUPON_STEPS.DETAILS);
  };

  const closeDiscardModal = () => {
    setShowDiscardModal(false);
    setIsCouponDiscardPending(false);
  };

  return {
    createCollectionFlow,
    uploadKindFlow,
    contentTypeFlow,
    couponForm,
    setCouponForm,
    isCouponSuccess,
    couponFlow,
    closeCouponFlow,
    requestCloseCouponFlow,
    isCouponDiscardPending,
    handleBackFromCouponPreview,
    handleCouponSubmit,
    showDiscardModal,
    openDiscardModal: () => setShowDiscardModal(true),
    closeDiscardModal,
    handleCreateClick,
    handleEditCollection,
    openCouponEdit,
    editingCouponId,
  };
};
