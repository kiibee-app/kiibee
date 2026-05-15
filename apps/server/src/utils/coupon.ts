import { STATUS } from './constant';

export const COUPON_STATUSES = ['active', 'inactive', 'completed'] as const;
export const COUPON_DISCOUNT_TYPES = ['fixed_amount', 'percentage'] as const;
export const COUPON_DISCOUNT_TYPE_PERCENTAGE = COUPON_DISCOUNT_TYPES[1];

export type CouponStatus = (typeof COUPON_STATUSES)[number];
export type CouponDiscountType = (typeof COUPON_DISCOUNT_TYPES)[number];

const isCouponStatus = (value: string): value is CouponStatus => {
  return COUPON_STATUSES.includes(value as CouponStatus);
};

const isCouponDiscountType = (value: string): value is CouponDiscountType => {
  return COUPON_DISCOUNT_TYPES.includes(value as CouponDiscountType);
};

export const normalizeCouponStatus = (status?: string): CouponStatus => {
  if (status && isCouponStatus(status)) {
    return status;
  }

  return STATUS.ACTIVE;
};

export const normalizeCouponDiscountType = (
  discountType?: string,
): CouponDiscountType | null => {
  const normalizedDiscountType = discountType;

  if (
    !normalizedDiscountType ||
    !isCouponDiscountType(normalizedDiscountType)
  ) {
    return null;
  }

  return normalizedDiscountType;
};
