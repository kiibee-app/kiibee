import { STATUS } from './constant';

const COUPON_STATUSES = [STATUS.ACTIVE, STATUS.INACTIVE, 'completed'] as const;
const COUPON_DISCOUNT_TYPES = ['fixed_amount', 'percentage'] as const;

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
  const normalizedDiscountType =
    discountType === 'fixedAmount' ? 'fixed_amount' : discountType;

  if (
    !normalizedDiscountType ||
    !isCouponDiscountType(normalizedDiscountType)
  ) {
    return null;
  }

  return normalizedDiscountType;
};
