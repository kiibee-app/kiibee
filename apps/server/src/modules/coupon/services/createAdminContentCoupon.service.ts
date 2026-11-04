import { BadRequestException, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema';
import {
  COUPON_DISCOUNT_TYPE_PERCENTAGE,
  MAX_ADMIN_COUPON_PERCENTAGE_DISCOUNT,
} from 'src/utils/coupon';
import { createCouponService } from './createCoupon.service';

export type AdminContentCouponPayload = {
  code?: unknown;
  percentage?: unknown;
  validFrom?: unknown;
  validUntil?: unknown;
};

export function validateAdminContentCoupon(
  payload: AdminContentCouponPayload,
  { allowExpired = false } = {},
) {
  const { code, percentage, validFrom, validUntil } = payload ?? {};
  if (
    typeof code !== 'string' ||
    !code.trim() ||
    code.trim().toUpperCase().length > 50
  ) {
    throw new BadRequestException('Enter a coupon code of up to 50 characters');
  }
  if (
    typeof percentage !== 'number' ||
    !Number.isInteger(percentage) ||
    percentage < 1 ||
    percentage > MAX_ADMIN_COUPON_PERCENTAGE_DISCOUNT
  ) {
    throw new BadRequestException('Enter a whole percentage from 1 to 100');
  }
  if (
    typeof validFrom !== 'string' ||
    typeof validUntil !== 'string' ||
    !Number.isFinite(Date.parse(validFrom)) ||
    !Number.isFinite(Date.parse(validUntil)) ||
    Date.parse(validUntil) <= Date.parse(validFrom)
  ) {
    throw new BadRequestException(
      'End date must be on or after the start date',
    );
  }

  if (!allowExpired && Date.parse(validUntil) <= Date.now()) {
    throw new BadRequestException('End date must not have passed');
  }

  return { code: code.trim().toUpperCase(), percentage, validFrom, validUntil };
}

export const createAdminContentCouponService = async (
  adminId: string,
  contentId: string,
  payload: AdminContentCouponPayload,
) => {
  const { code, percentage, validFrom, validUntil } =
    validateAdminContentCoupon(payload);
  const [content] = await db
    .select({ currency: mediaFiles.currency })
    .from(mediaFiles)
    .where(and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)))
    .limit(1);
  if (!content) throw new NotFoundException('Content not found');

  return createCouponService(
    adminId,
    {
      title: code,
      codes: [code],
      discountType: COUPON_DISCOUNT_TYPE_PERCENTAGE,
      discountValue: percentage,
      currency: content.currency ?? undefined,
      validFrom,
      validUntil,
      contentIds: [contentId],
    },
    { adminContentCoupon: true },
  );
};
