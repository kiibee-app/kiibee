import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CollectionRow, INITIAL_COUPON_FORM } from "@/types/collectionsType";
import {
  COLLECTIONS,
  COUPON_DISCOUNT_FIXED_AMOUNT,
  COUPONS,
  ContentTab,
} from "@/utils/common";
import {
  COUPON_API_DISCOUNT_TYPE,
  type CreateCouponPayload,
} from "@/types/couponType";
import { API } from "@/lib/http/api/endpoints";
import { usePostAPI } from "@/lib/http/api/postApi";
import {
  COUPON_STEPS,
  CouponStep,
  isUploadContentType,
  STEP_ORDER,
  type ContentType,
} from "@/utils/content";
import { COLLECTION, CONTENT } from "@/utils/ui";

export const useContentsModalFlows = (
  activeTab: ContentTab,
  collections: CollectionRow[],
  isCollectionContentMode: boolean,
) => {
  const queryClient = useQueryClient();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [couponForm, setCouponForm] = useState(INITIAL_COUPON_FORM);
  const [isCouponSuccess, setIsCouponSuccess] = useState(false);
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
  const couponFlow = {
    open: () => setCouponStep(COUPON_STEPS.DETAILS),
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
      preview: couponStep === COUPON_STEPS.PREVIEW,
    },
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
    completeCreate: () => {
      if (!collectionName.trim()) return;
      setShowCreateModal(false);
      setCollectionName("");
      setEditingCollectionId(null);
      setShowSuccessModal(true);
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
      if (isUploadContentType(contentType)) {
        setShowContentUploadModal(true);
        return;
      }

      setShowContentUploadModal(false);
    },
  };

  const closeCouponFlow = () => {
    setCouponForm(INITIAL_COUPON_FORM);
    setIsCouponSuccess(false);
    couponFlow.close();
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
    const codes = couponForm.codes
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code.length > 0);

    await createCouponMutation.mutateAsync({
      title: couponForm.title.trim(),
      discountType:
        couponForm.discountType === COUPON_DISCOUNT_FIXED_AMOUNT
          ? COUPON_API_DISCOUNT_TYPE.FIXED_AMOUNT
          : COUPON_API_DISCOUNT_TYPE.PERCENTAGE,
      discountValue: couponForm.discountValue.trim(),
      codes,
      collectionId:
        couponForm.collection && !couponForm.collection.startsWith(COLLECTION)
          ? couponForm.collection
          : undefined,
      contentId:
        couponForm.content && !couponForm.content.startsWith(CONTENT)
          ? couponForm.content
          : undefined,
    });

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

  return {
    createCollectionFlow,
    contentTypeFlow,
    couponForm,
    setCouponForm,
    isCouponSuccess,
    couponFlow,
    closeCouponFlow,
    handleBackFromCouponPreview,
    handleCouponSubmit,
    showDiscardModal,
    openDiscardModal: () => setShowDiscardModal(true),
    closeDiscardModal: () => setShowDiscardModal(false),
    handleCreateClick,
    handleEditCollection,
  };
};
