import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  couponCodes,
  coupons,
  couponApplicableItems,
  collectionItems,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import {
  COUPON_DISCOUNT_TYPE_PERCENTAGE,
  MAX_COUPON_PERCENTAGE_DISCOUNT,
} from 'src/utils/coupon';

const isCouponApplicableToContent = async (
  couponId: string,
  contentId: string,
) => {
  const applicableItems = await db
    .select({
      mediaFileId: couponApplicableItems.mediaFileId,
      collectionId: couponApplicableItems.collectionId,
    })
    .from(couponApplicableItems)
    .where(eq(couponApplicableItems.couponId, couponId));

  if (applicableItems.length === 0) {
    return true;
  }

  const hasDirectMatch = applicableItems.some(
    (item) => item.mediaFileId === contentId,
  );
  if (hasDirectMatch) {
    return true;
  }

  const collectionIds = applicableItems
    .map((item) => item.collectionId)
    .filter((id): id is string => Boolean(id));

  if (collectionIds.length === 0) {
    return false;
  }

  const [collectionMatch] = await db
    .select({ id: collectionItems.id })
    .from(collectionItems)
    .where(
      and(
        eq(collectionItems.mediaFileId, contentId),
        inArray(collectionItems.collectionId, collectionIds),
      ),
    )
    .limit(1);

  return Boolean(collectionMatch);
};

export const verifyCouponService = async (code: string, contentId?: string) => {
  try {
    const [couponCode] = await db
      .select()
      .from(couponCodes)
      .where(eq(couponCodes.code, code))
      .limit(1);

    if (!couponCode) {
      return fail('Invalid coupon code', HttpStatus.BAD_REQUEST);
    }

    if (couponCode.isUsed) {
      return fail('Coupon code has already been used', HttpStatus.BAD_REQUEST);
    }

    const [coupon] = await db
      .select()
      .from(coupons)
      .where(
        and(
          eq(coupons.id, couponCode.couponId),
          eq(coupons.isDeleted, false),
          eq(coupons.status, 'active'),
        ),
      )
      .limit(1);

    if (!coupon) {
      return fail('Coupon is not active', HttpStatus.BAD_REQUEST);
    }

    const now = new Date();

    if (coupon.validFrom && now < coupon.validFrom) {
      return fail('Coupon is not yet valid', HttpStatus.BAD_REQUEST);
    }

    if (coupon.validUntil && now > coupon.validUntil) {
      return fail('Coupon has expired', HttpStatus.BAD_REQUEST);
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return fail('Coupon has reached maximum uses', HttpStatus.BAD_REQUEST);
    }

    if (contentId) {
      const isApplicable = await isCouponApplicableToContent(
        coupon.id,
        contentId,
      );

      if (!isApplicable) {
        return fail(
          'Coupon is not applicable to this content',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const discountValue = Number(coupon.discountValue);
    const discountType = coupon.discountType;

    if (
      discountType === COUPON_DISCOUNT_TYPE_PERCENTAGE &&
      discountValue > MAX_COUPON_PERCENTAGE_DISCOUNT
    ) {
      return fail(
        `Percentage discount cannot be greater than ${MAX_COUPON_PERCENTAGE_DISCOUNT}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return success(
      {
        code: couponCode.code,
        discountType,
        discountValue,
        title: coupon.title,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
      },
      'Coupon verified successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Error verifying coupon:', error);

    return fail('Failed to verify coupon', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
