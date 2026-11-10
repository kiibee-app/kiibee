import { ConflictException, NotFoundException } from '@nestjs/common';
import { and, desc, eq, exists } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  couponApplicableItems,
  couponCodes,
  coupons,
  users,
} from 'src/database/schema';
import { ROLE } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';
import {
  validateAdminContentCoupon,
  type AdminContentCouponPayload,
} from './createAdminContentCoupon.service';

function contentCouponScope(contentId: string) {
  return and(
    eq(coupons.isDeleted, false),
    exists(
      db
        .select()
        .from(users)
        .where(
          and(eq(users.id, coupons.creatorId), eq(users.role, ROLE.ADMIN)),
        ),
    ),
    exists(
      db
        .select()
        .from(couponApplicableItems)
        .where(
          and(
            eq(couponApplicableItems.couponId, coupons.id),
            eq(couponApplicableItems.mediaFileId, contentId),
          ),
        ),
    ),
  );
}

export async function listAdminContentCoupons(contentId: string) {
  const rows = await db
    .select({
      id: coupons.id,
      code: couponCodes.code,
      percentage: coupons.discountValue,
      validFrom: coupons.validFrom,
      validUntil: coupons.validUntil,
    })
    .from(coupons)
    .innerJoin(couponCodes, eq(couponCodes.couponId, coupons.id))
    .where(contentCouponScope(contentId))
    .orderBy(desc(coupons.createdAt));

  return success(rows);
}

export async function editAdminContentCoupon(
  contentId: string,
  couponId: string,
  payload: AdminContentCouponPayload,
) {
  const { code, percentage, validFrom, validUntil } =
    validateAdminContentCoupon(payload, { allowExpired: true });
  try {
    await db.transaction(async (tx) => {
      const [coupon] = await tx
        .update(coupons)
        .set({
          title: code,
          discountValue: percentage.toFixed(2),
          validFrom: new Date(validFrom),
          validUntil: new Date(validUntil),
          updatedAt: new Date(),
        })
        .where(and(eq(coupons.id, couponId), contentCouponScope(contentId)))
        .returning({ id: coupons.id });
      if (!coupon) throw new NotFoundException('Coupon not found');

      await tx
        .update(couponCodes)
        .set({ code, updatedAt: new Date() })
        .where(eq(couponCodes.couponId, couponId));
    });
  } catch (error) {
    if ((error as { cause?: { code?: string } }).cause?.code === '23505') {
      throw new ConflictException('Coupon code already exists');
    }
    throw error;
  }
  return success(null, 'Coupon updated successfully');
}

export async function removeAdminContentCoupon(
  contentId: string,
  couponId: string,
) {
  const [coupon] = await db
    .update(coupons)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(and(eq(coupons.id, couponId), contentCouponScope(contentId)))
    .returning({ id: coupons.id });
  if (!coupon) throw new NotFoundException('Coupon not found');
  return success(null, 'Coupon deleted successfully');
}
