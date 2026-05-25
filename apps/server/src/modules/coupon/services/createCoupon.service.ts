import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { db } from 'src/database/db';
import {
  couponApplicableItems,
  couponCodes,
  coupons,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import {
  COUPON_DISCOUNT_TYPE_PERCENTAGE,
  normalizeCouponDiscountType,
  normalizeCouponStatus,
} from 'src/utils/coupon';

export type CouponPayload = {
  title?: string;
  discountType?: string;
  discountValue?: string | number;
  currency?: string;
  status?: string;
  validFrom?: string;
  validUntil?: string;
  maxUses?: number;
  codes?: string[];
  collectionIds?: string[];
  contentIds?: string[];
};

export const normalizeIdList = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .filter((v): v is string => typeof v === 'string')
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  );
};

export const createCouponService = async (
  creatorId: string,
  payload: CouponPayload,
) => {
  try {
    const trimmedTitle = payload.title?.trim() ?? '';
    const normalizedDiscountType = normalizeCouponDiscountType(
      payload.discountType,
    );
    const normalizedCurrency = payload.currency?.trim().toUpperCase() || 'DKK';
    const normalizedStatus = normalizeCouponStatus(payload.status);
    const parsedDiscountValue = Number(payload.discountValue ?? 0);
    const normalizedCodes = (payload.codes ?? [])
      .map((code) => code.trim())
      .filter((code) => code.length > 0);

    if (!trimmedTitle) {
      throw new HttpException(
        'Coupon title is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!normalizedDiscountType) {
      throw new HttpException(
        'Discount type must be fixed_amount or percentage',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (Number.isNaN(parsedDiscountValue) || parsedDiscountValue <= 0) {
      throw new HttpException(
        'Discount value must be greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      normalizedDiscountType === COUPON_DISCOUNT_TYPE_PERCENTAGE &&
      parsedDiscountValue > 100
    ) {
      throw new HttpException(
        'Percentage discount cannot be greater than 100',
        HttpStatus.BAD_REQUEST,
      );
    }

    const validFrom = payload.validFrom ? new Date(payload.validFrom) : null;
    const validUntil = payload.validUntil ? new Date(payload.validUntil) : null;

    if (validFrom && validUntil && validFrom >= validUntil) {
      throw new HttpException(
        'validUntil must be later than validFrom',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdCoupon = await db.transaction(async (tx) => {
      const newCoupon: typeof coupons.$inferInsert = {
        id: randomUUID(),
        creatorId,
        title: trimmedTitle,
        discountType: normalizedDiscountType,
        discountValue: parsedDiscountValue.toFixed(2),
        currency: normalizedCurrency,
        status: normalizedStatus,
        validFrom,
        validUntil,
        maxUses: payload.maxUses ?? null,
      };

      const [insertedCoupon] = await tx
        .insert(coupons)
        .values(newCoupon)
        .returning();

      if (normalizedCodes.length > 0) {
        const codeRows: (typeof couponCodes.$inferInsert)[] =
          normalizedCodes.map((code) => ({
            id: randomUUID(),
            couponId: insertedCoupon.id,
            code,
          }));
        await tx.insert(couponCodes).values(codeRows);
      }

      const applicableItemRows: Array<
        typeof couponApplicableItems.$inferInsert
      > = [];

      const collectionIds = normalizeIdList(payload.collectionIds);
      const contentIds = normalizeIdList(payload.contentIds);

      collectionIds.forEach((collectionId) => {
        applicableItemRows.push({
          id: randomUUID(),
          couponId: insertedCoupon.id,
          collectionId,
        });
      });

      contentIds.forEach((contentId) => {
        applicableItemRows.push({
          id: randomUUID(),
          couponId: insertedCoupon.id,
          mediaFileId: contentId,
        });
      });

      if (applicableItemRows.length > 0) {
        await tx.insert(couponApplicableItems).values(applicableItemRows);
      }

      return insertedCoupon;
    });

    const responseCollectionIds = normalizeIdList(payload.collectionIds);
    const responseContentIds = normalizeIdList(payload.contentIds);

    return success(
      {
        ...createdCoupon,
        discountCodes: normalizedCodes,
        applicableProducts: {
          collectionIds: responseCollectionIds,
          contentIds: responseContentIds,
        },
      },
      'Coupon created successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error('Error creating coupon:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to create coupon',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
