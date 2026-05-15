export type CouponRow = {
  title: string;
  codes: string[];
  status: CouponStatus;
  createdAt: string;
  action: string;
};

export const COUPON_API_DISCOUNT_TYPE = {
  FIXED_AMOUNT: "fixed_amount",
  PERCENTAGE: "percentage",
} as const;

export type CouponApiDiscountType =
  (typeof COUPON_API_DISCOUNT_TYPE)[keyof typeof COUPON_API_DISCOUNT_TYPE];

export type CreateCouponPayload = {
  title: string;
  discountType: CouponApiDiscountType;
  discountValue: string;
  codes: string[];
  collectionId?: string;
  contentId?: string;
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
  status: Lowercase<CouponStatus>;
  createdAt: string;
  codes?: string[];
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
