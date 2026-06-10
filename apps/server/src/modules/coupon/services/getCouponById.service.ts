import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  couponApplicableItems,
  couponCodes,
  coupons,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getCouponByIdService = async (
  creatorId: string,
  couponId: string,
) => {
  try {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(
        and(
          eq(coupons.id, couponId),
          eq(coupons.creatorId, creatorId),
          eq(coupons.isDeleted, false),
        ),
      )
      .limit(1);

    if (!coupon) {
      return fail('Coupon not found', HttpStatus.NOT_FOUND);
    }

    const couponCodeRows = await db
      .select({
        code: couponCodes.code,
      })
      .from(couponCodes)
      .where(
        and(eq(couponCodes.couponId, coupon.id), eq(couponCodes.isUsed, false)),
      );

    const applicableItemRows = await db
      .select({
        collectionId: couponApplicableItems.collectionId,
        mediaFileId: couponApplicableItems.mediaFileId,
      })
      .from(couponApplicableItems)
      .where(eq(couponApplicableItems.couponId, coupon.id));

    const collectionIds = Array.from(
      new Set(
        applicableItemRows
          .map((row) => row.collectionId)
          .filter((value): value is string => Boolean(value)),
      ),
    );
    const contentIds = Array.from(
      new Set(
        applicableItemRows
          .map((row) => row.mediaFileId)
          .filter((value): value is string => Boolean(value)),
      ),
    );

    return success(
      {
        ...coupon,
        codes: couponCodeRows.map((row) => row.code),
        applicableProducts: {
          collectionIds,
          contentIds,
        },
      },
      'Coupon retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching coupon by id:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to retrieve coupon',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
