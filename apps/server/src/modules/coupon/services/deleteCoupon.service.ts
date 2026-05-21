import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { coupons } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const deleteCouponService = async (
  creatorId: string,
  couponId: string,
) => {
  try {
    const [existing] = await db
      .select({ id: coupons.id })
      .from(coupons)
      .where(
        and(
          eq(coupons.id, couponId),
          eq(coupons.creatorId, creatorId),
          eq(coupons.isDeleted, false),
        ),
      )
      .limit(1);

    if (!existing) {
      return fail('Coupon not found', HttpStatus.NOT_FOUND);
    }

    await db
      .update(coupons)
      .set({ isDeleted: true })
      .where(eq(coupons.id, couponId));

    return success(null, 'Coupon deleted successfully');
  } catch (error) {
    logger.error('Failed to delete coupon', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail('Failed to delete coupon', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
