"use client";

import { CollectionRow } from "@/types/collectionsType";
import CouponDetailsModal from "@/components/Feature/Contents/coupon/coupon-details";
import CouponCodesModal from "@/components/Feature/Contents/coupon/coupon-codes";
import CouponApplicableProductsModal from "@/components/Feature/Contents/coupon/coupon-applicable-products";
import CouponPreviewModal from "./CouponPreviewModal";
import { CreateCouponPayload } from "@/types/couponType";

type CouponFlowState = {
  isOpen: {
    details: boolean;
    codes: boolean;
    applicableProducts: boolean;
    preview: boolean;
  };
  next: () => void;
  back: () => void;
};

type Props = {
  collections: CollectionRow[];
  couponFlow: CouponFlowState;
  couponForm: CreateCouponPayload;
  setCouponForm: React.Dispatch<React.SetStateAction<CreateCouponPayload>>;
  closeCouponFlow: () => void;
  handleBackFromCouponPreview: () => void;
  handleCouponSubmit: () => Promise<void>;
  isCouponSuccess: boolean;
};

export default function CouponFlowModals({
  collections,
  couponFlow,
  couponForm,
  setCouponForm,
  closeCouponFlow,
  handleBackFromCouponPreview,
  handleCouponSubmit,
  isCouponSuccess,
}: Props) {
  return (
    <>
      <CouponDetailsModal
        visible={couponFlow.isOpen.details}
        form={couponForm}
        setForm={setCouponForm}
        onClose={closeCouponFlow}
        onNext={couponFlow.next}
      />

      <CouponCodesModal
        visible={couponFlow.isOpen.codes}
        form={couponForm}
        setForm={setCouponForm}
        onBack={couponFlow.back}
        onClose={closeCouponFlow}
        onNext={couponFlow.next}
      />

      <CouponApplicableProductsModal
        visible={couponFlow.isOpen.applicableProducts}
        form={couponForm}
        collections={collections}
        setForm={setCouponForm}
        onBack={couponFlow.back}
        onClose={closeCouponFlow}
        onNext={couponFlow.next}
      />

      <CouponPreviewModal
        visible={couponFlow.isOpen.preview}
        data={couponForm}
        collections={collections}
        onBack={handleBackFromCouponPreview}
        onClose={closeCouponFlow}
        onContinue={handleCouponSubmit}
        isSuccess={isCouponSuccess}
      />
    </>
  );
}
