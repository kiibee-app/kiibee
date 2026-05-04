export type CouponRow = {
  title: string;
  codes: string[];
  status: CouponStatus;
  createdAt: string;
  action: string;
};

export const COUPON_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  COMPLETED: "Completed",
} as const;

export type CouponStatus = (typeof COUPON_STATUS)[keyof typeof COUPON_STATUS];
