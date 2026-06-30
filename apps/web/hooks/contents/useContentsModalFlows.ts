import { Dispatch, SetStateAction, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

export const useContentsModalFlows = (
  activeTab: ContentTab,
  collections: CollectionRow[],
  isCollectionContentMode: boolean,
  setCollections: Dispatch<SetStateAction<CollectionRow[]>>,
  resetAfterRefetch: () => void,
) => {
  const queryClient = useQueryClient();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [couponForm, setCouponForm] = useState(INITIAL_COUPON_FORM);
  const [couponInitialForm, setCouponInitialForm] =
    useState(INITIAL_COUPON_FORM);
  const [isCouponDiscardPending, setIsCouponDiscardPending] = useState(false);
  const [isCouponSuccess, setIsCouponSuccess] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

        const created = (await createCollectionMutation.mutateAsync({
          name: trimmedName,
        })) as { id?: string; name?: string };

        const createdId = created?.id;
        const createdName = created?.name;

        if (!createdId || !createdName) {
          await queryClient.invalidateQueries({
            queryKey: [API.collection.getAll],
          });
          resetCreateFlow();
          return;
        }

        setCollections((prev) => [
          ...prev,
          {
            id: createdId,
            name: createdName,
            contentsCount: 0,
            createdAt: new Date().toISOString(),
            actions: "",
          },
        ]);

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
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const apiError =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save collection";
        toast.error(apiError);
      }
    },
    closeSuccess: () => setShowSuccessModal(false),
    openSuccess: () => setShowSuccessModal(true),
  };

  const contentTypeFlow = {
    showContentTypeModal,
    showContentUploadModal,
    selectedContentType,
    open: () => setShowContentTypeModal(true),
    close: () => {
      setShowContentTypeModal(false);
      setShowContentUploadModal(false);
      setSelectedContentType(null);
    },
    backToTypeSelect: () => {
      setShowContentUploadModal(false);
      setShowContentTypeModal(true);
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

    const payload: CreateCouponPayload = {
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
    };

    const submitRequest = editingCouponId
      ? axiosClient.patch(API.coupon.update(editingCouponId), payload)
      : createCouponMutation.mutateAsync(payload);

    await submitRequest;

    await queryClient.invalidateQueries({ queryKey: [API.coupon.getAll] });
    setIsCouponSuccess(true);
  };

  const handleCreateClick = () => {
    if (activeTab === COUPONS) {
      couponFlow.open();
      return;
    }
    if (activeTab === COLLECTIONS) {
      if (isCollectionContentMode) {
        contentTypeFlow.open();
        return;
      }
      createCollectionFlow.openCreate();
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
