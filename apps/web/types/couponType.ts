import { CouponDiscountType } from "@/utils/common";

export type CouponRow = {
  title: string;
  codes: string[];
  status: CouponStatus;
  createdAt: string;
  action: string;
};

export type CreateCouponPayload = {
  title: string;
  discountType: CouponDiscountType;
  discountValue: string;
  codes: string[];
  collectionIds?: string[];
  contentIds?: string[];
  startDate?: string;
  endDate?: string;
};

export const COUPON_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  COMPLETED: "Completed",
} as const;

export type CouponStatus = (typeof COUPON_STATUS)[keyof typeof COUPON_STATUS];

export type CouponEntity = {
  id: string;
  title: string;
  discountType?: CouponDiscountType;
  discountValue?: string;
  status: Lowercase<CouponStatus>;
  createdAt: string;
  codes?: string[];
  applicableProducts?: {
    collectionIds?: string[] | null;
    contentIds?: string[] | null;
  };
  startDate?: string;
  endDate?: string;
};

export type CouponListResponse = {
  success?: boolean;
  data?: CouponEntity[];
};

export const COUPON_STATUS_LABEL_MAP: Record<
  Lowercase<CouponStatus>,
  CouponStatus
> = {
  active: COUPON_STATUS.ACTIVE,
  inactive: COUPON_STATUS.INACTIVE,
  completed: COUPON_STATUS.COMPLETED,
};
