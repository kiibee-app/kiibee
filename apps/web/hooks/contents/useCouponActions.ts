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
import {
  COUPON_STATUS,
  COUPON_STATUS_LABEL_MAP,
  CreateCouponPayload,
  type CouponEntity,
  type CouponListResponse,
  type CouponRow,
} from "@/types/couponType";

type UseCouponActionsParams = {
  activeTab: ContentTab;
  onEditCoupon: (couponId: string, formState: CreateCouponPayload) => void;
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

  const mapCouponToForm = (coupon: CouponEntity): CreateCouponPayload => {
    return {
      title: coupon.title ?? "",
      discountType: coupon.discountType ?? COUPON_DISCOUNT_TYPE.FIXED_AMOUNT,
      discountValue: coupon.discountValue ?? "",
      codes: coupon.codes ?? [],
      collectionIds: coupon.applicableProducts?.collectionIds ?? [],
      contentIds: coupon.applicableProducts?.contentIds ?? [],
    };
  };

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

  const openEditCoupon = (coupon: CouponEntity) => {
    onEditCoupon(coupon.id, mapCouponToForm(coupon));
  };

  const handleCouponAction = async (action: CouponAction, row: CouponRow) => {
    const couponId = row.action;
    if (!couponId) return;

    const selectedCoupon = couponResponse?.data?.find((c) => c.id === couponId);

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
      [COUPON_ACTION_EDIT]: () => {
        if (!selectedCoupon) return;
        openEditCoupon(selectedCoupon);
      },
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
    couponList: couponResponse?.data ?? [],
    handleCouponAction,
    handleCouponDeleteConfirm,
    handleCouponDeleteModalClose,
    showCouponDeleteConfirm,
    setShowCouponDeleteConfirm,
    showCouponDeleteSuccess,
    setShowCouponDeleteSuccess,
    openEditCoupon,
  };
};
