import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  couponCodes,
  coupons,
  couponApplicableItems,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

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
      const [applicableItem] = await db
        .select()
        .from(couponApplicableItems)
        .where(
          and(
            eq(couponApplicableItems.couponId, coupon.id),
            eq(couponApplicableItems.mediaFileId, contentId),
          ),
        )
        .limit(1);

      if (!applicableItem) {
        const [anyItem] = await db
          .select()
          .from(couponApplicableItems)
          .where(eq(couponApplicableItems.couponId, coupon.id))
          .limit(1);

        if (!anyItem) {
          return fail(
            'Coupon is not applicable to this content',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    const discountValue = Number(coupon.discountValue);
    const discountType = coupon.discountType;

    return success(
      {
        code: couponCode.code,
        discountType,
        discountValue,
        title: coupon.title,
      },
      'Coupon verified successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error verifying coupon:', error);

    return fail('Failed to verify coupon', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
