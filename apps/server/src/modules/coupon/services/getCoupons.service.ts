import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { couponCodes, coupons } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';

export const getCouponsService = async (creatorId: string) => {
  try {
    const couponRows = await db
      .select()
      .from(coupons)
      .where(
        and(eq(coupons.creatorId, creatorId), eq(coupons.isDeleted, false)),
      )
      .orderBy(desc(coupons.createdAt));

    const couponIds = couponRows.map((coupon) => coupon.id);

    if (couponIds.length === 0) {
      return success([], 'Coupons retrieved successfully', HttpStatus.OK);
    }

    const couponCodeRows = await db
      .select({
        couponId: couponCodes.couponId,
        code: couponCodes.code,
      })
      .from(couponCodes)
      .where(eq(couponCodes.isUsed, false));

    const codesByCouponId = couponCodeRows.reduce<Record<string, string[]>>(
      (acc, row) => {
        if (!couponIds.includes(row.couponId)) return acc;
        acc[row.couponId] = [...(acc[row.couponId] || []), row.code];
        return acc;
      },
      {},
    );

    const couponList = couponRows.map((coupon) => ({
      ...coupon,
      codes: codesByCouponId[coupon.id] || [],
    }));

    return success(couponList, 'Coupons retrieved successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Error fetching coupons:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to retrieve coupons',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
