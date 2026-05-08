import { useState } from "react";
import { CollectionRow, INITIAL_COUPON_FORM } from "@/types/collectionsType";
import { COLLECTIONS, COUPONS, ContentTab } from "@/utils/common";
import { COUPON_STEPS, CouponStep, STEP_ORDER } from "@/utils/content";

export const useContentsModalFlows = (
  activeTab: ContentTab,
  collections: CollectionRow[],
) => {
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [couponForm, setCouponForm] = useState(INITIAL_COUPON_FORM);
  const [isCouponSuccess, setIsCouponSuccess] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [couponStep, setCouponStep] = useState<CouponStep | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(
    null,
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
    setIsCouponSuccess(true);
  };

  const handleCreateClick = () => {
    if (activeTab === COUPONS) {
      couponFlow.open();
      return;
    }
    if (activeTab === COLLECTIONS) {
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
