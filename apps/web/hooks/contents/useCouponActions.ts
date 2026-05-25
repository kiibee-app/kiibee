import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { formatDateUSShort } from "@/utils/formatDate";
import { ContentTab, COUPONS, COUPON_DISCOUNT_TYPE } from "@/utils/common";
import {
  COUPON_ACTION_DELETE,
  COUPON_ACTION_EDIT,
  COUPON_ACTION_STATUS,
  CouponAction,
} from "@/utils/Constants";
import { CouponFormState } from "@/types/collectionsType";
import {
  COUPON_STATUS,
  COUPON_STATUS_LABEL_MAP,
  type CouponEntity,
  type CouponListResponse,
  type CouponRow,
} from "@/types/couponType";

type UseCouponActionsParams = {
  activeTab: ContentTab;
  onEditCoupon: (couponId: string, formState: CouponFormState) => void;
};

export const useCouponActions = ({
  activeTab,
  onEditCoupon,
}: UseCouponActionsParams) => {
  const queryClient = useQueryClient();
  const [showCouponDeleteConfirm, setShowCouponDeleteConfirm] = useState(false);
  const [showCouponDeleteSuccess, setShowCouponDeleteSuccess] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);

  const { data: couponResponse } = useGetAPI<CouponListResponse>(
    API.coupon.getAll,
    undefined,
    {
      enabled: activeTab === COUPONS,
    },
  );

  const getCouponStatusLabel = (status: CouponEntity["status"]) =>
    COUPON_STATUS_LABEL_MAP[status];

  const couponRows: CouponRow[] = (couponResponse?.data ?? []).map((item) => ({
    title: item.title,
    codes: item.codes ?? [],
    status: getCouponStatusLabel(item.status),
    createdAt: formatDateUSShort(item.createdAt),
    action: item.id,
  }));

  const handleCouponDeleteConfirm = async () => {
    if (!selectedCouponId) return;

    await axiosClient.delete(API.coupon.delete(selectedCouponId));
    await queryClient.invalidateQueries({ queryKey: [API.coupon.getAll] });
    setShowCouponDeleteConfirm(false);
    setSelectedCouponId(null);
    setShowCouponDeleteSuccess(true);
  };

  const handleCouponAction = async (action: CouponAction, row: CouponRow) => {
    const couponId = row.action;
    if (!couponId) return;

    const coupons = couponResponse?.data ?? [];
    const selectedCoupon = coupons.find((item) => item.id === couponId);

    const openEdit = () => {
      if (!selectedCoupon) return;

      const collectionIdsFromEntity =
        selectedCoupon.applicableProducts?.collectionIds ?? null;
      const contentIdsFromEntity =
        selectedCoupon.applicableProducts?.contentIds ?? null;

      onEditCoupon(selectedCoupon.id, {
        title: selectedCoupon.title ?? "",
        discountType:
          selectedCoupon.discountType ?? COUPON_DISCOUNT_TYPE.FIXED_AMOUNT,
        discountValue: selectedCoupon.discountValue ?? "",
        codes: (selectedCoupon.codes ?? []).join(", "),
        collectionIds: Array.isArray(collectionIdsFromEntity)
          ? collectionIdsFromEntity
          : [],
        contentIds: Array.isArray(contentIdsFromEntity)
          ? contentIdsFromEntity
          : [],
      });
    };

    const openDelete = () => {
      setSelectedCouponId(couponId);
      setShowCouponDeleteConfirm(true);
    };

    const toggleStatus = async () => {
      const nextStatus =
        row.status === COUPON_STATUS.ACTIVE
          ? COUPON_STATUS.INACTIVE.toLowerCase()
          : COUPON_STATUS.ACTIVE.toLowerCase();

      await axiosClient.patch(API.coupon.update(couponId), {
        status: nextStatus,
      });
      await queryClient.invalidateQueries({ queryKey: [API.coupon.getAll] });
    };

    const actionMap: Record<CouponAction, () => Promise<void> | void> = {
      [COUPON_ACTION_EDIT]: openEdit,
      [COUPON_ACTION_DELETE]: openDelete,
      [COUPON_ACTION_STATUS]: toggleStatus,
    };

    return actionMap[action]?.();
  };

  const handleCouponDeleteModalClose = () => {
    setSelectedCouponId(null);
  };

  return {
    couponRows,
    handleCouponAction,
    handleCouponDeleteConfirm,
    handleCouponDeleteModalClose,
    showCouponDeleteConfirm,
    setShowCouponDeleteConfirm,
    showCouponDeleteSuccess,
    setShowCouponDeleteSuccess,
  };
};
