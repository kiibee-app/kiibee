import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  couponApplicableItems,
  couponCodes,
  coupons,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import {
  APPLICABLE_PRODUCT_KEYS,
  ApplicableProductKey,
  COUPON_DISCOUNT_TYPE_PERCENTAGE,
  normalizeCouponDiscountType,
  normalizeCouponStatus,
} from 'src/utils/coupon';
import { fail, success } from 'src/utils/sendResponse';
import { CouponPayload, normalizeIdList } from './createCoupon.service';

const pickDefined = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  );

export const updateCouponService = async (
  creatorId: string,
  couponId: string,
  payload: CouponPayload,
) => {
  try {
    const hasOwn = (key: keyof CouponPayload) => Object.hasOwn(payload, key);
    const where = and(
      eq(coupons.id, couponId),
      eq(coupons.creatorId, creatorId),
      eq(coupons.isDeleted, false),
    );

    const [existing] = await db.select().from(coupons).where(where).limit(1);

    if (!existing) {
      return fail('Coupon not found', HttpStatus.NOT_FOUND);
    }

    const nextDiscountType =
      payload.discountType !== undefined
        ? normalizeCouponDiscountType(payload.discountType)
        : existing.discountType;

    if (payload.discountType !== undefined) {
      if (!nextDiscountType) {
        return fail(
          'Discount type must be fixed_amount or percentage',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const parsedDiscountValue =
      payload.discountValue !== undefined
        ? Number(payload.discountValue)
        : undefined;
    if (payload.discountValue !== undefined) {
      if (
        parsedDiscountValue === undefined ||
        Number.isNaN(parsedDiscountValue) ||
        parsedDiscountValue <= 0
      ) {
        return fail(
          'Discount value must be greater than 0',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        nextDiscountType === COUPON_DISCOUNT_TYPE_PERCENTAGE &&
        parsedDiscountValue > 100
      ) {
        return fail(
          'Percentage discount cannot be greater than 100',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updateData = pickDefined({
      title: payload.title?.trim() || undefined,
      discountType:
        payload.discountType !== undefined ? nextDiscountType : undefined,
      discountValue:
        parsedDiscountValue !== undefined
          ? parsedDiscountValue.toFixed(2)
          : undefined,
      currency: payload.currency?.trim()
        ? payload.currency.trim().toUpperCase()
        : undefined,
      status:
        payload.status !== undefined
          ? normalizeCouponStatus(payload.status)
          : undefined,
      validFrom:
        payload.validFrom !== undefined
          ? payload.validFrom
            ? new Date(payload.validFrom)
            : null
          : undefined,
      validUntil:
        payload.validUntil !== undefined
          ? payload.validUntil
            ? new Date(payload.validUntil)
            : null
          : undefined,
      maxUses:
        payload.maxUses !== undefined ? (payload.maxUses ?? null) : undefined,
    });

    const hasCodeUpdates = payload.codes !== undefined;
    const hasApplicableItemUpdates = APPLICABLE_PRODUCT_KEYS.some((key) =>
      hasOwn(key as ApplicableProductKey),
    );

    if (
      Object.keys(updateData).length === 0 &&
      !hasCodeUpdates &&
      !hasApplicableItemUpdates
    ) {
      return success(existing, 'No changes to update');
    }

    const [updated] = await db.transaction(async (tx) => {
      const [couponRow] = await tx
        .update(coupons)
        .set(updateData)
        .where(where)
        .returning();

      if (hasCodeUpdates) {
        await tx.delete(couponCodes).where(eq(couponCodes.couponId, couponId));
        const normalizedCodes = (payload.codes ?? [])
          .map((code) => code.trim())
          .filter((code) => code.length > 0);
        if (normalizedCodes.length > 0) {
          await tx.insert(couponCodes).values(
            normalizedCodes.map((code) => ({
              id: randomUUID(),
              couponId,
              code,
            })),
          );
        }
      }

      if (hasApplicableItemUpdates) {
        await tx
          .delete(couponApplicableItems)
          .where(eq(couponApplicableItems.couponId, couponId));

        const collectionIds = normalizeIdList(payload.collectionIds);
        const contentIds = normalizeIdList(payload.contentIds);

        const applicableItems: (typeof couponApplicableItems.$inferInsert)[] = [
          ...collectionIds.map((collectionId) => ({
            id: randomUUID(),
            couponId,
            collectionId,
          })),
          ...contentIds.map((contentId) => ({
            id: randomUUID(),
            couponId,
            mediaFileId: contentId,
          })),
        ];

        if (applicableItems.length > 0) {
          await tx.insert(couponApplicableItems).values(applicableItems);
        }
      }

      return [couponRow];
    });

    return success(updated, 'Coupon updated successfully');
  } catch (error) {
    logger.error('Failed to update coupon', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail('Failed to update coupon', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
