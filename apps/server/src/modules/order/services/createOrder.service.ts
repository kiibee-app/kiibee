import { db } from 'src/database/db';
import { orders } from 'src/database/schema/commerce/orders.schema';
import { CreateOrderInputDto } from '../dto/order.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { logger } from 'src/logger/logger';
import { HttpException } from '@nestjs/common';
import { fail, success } from 'src/utils/sendResponse';
import { mediaFiles, userContentAccess } from 'src/database/schema';
import { and, eq } from 'drizzle-orm';
import { createPayment } from 'src/modules/payment/services/createPayment.service';
import { ACCRESS_TYPES, ORDER_STATUS, ORDER_TYPES } from 'src/utils/constant';
import { COUPON_DISCOUNT_TYPE_PERCENTAGE } from 'src/utils/coupon';
import { verifyCouponService } from 'src/modules/coupon/services/verifyCoupon.service';

export async function createOrderService(
  userId: string,
  dto: CreateOrderInputDto,
) {
  try {
    const { contentId, collectionId, itemType, couponCode, subscriptionId } =
      dto;

    if (!contentId) {
      return fail('contentId must be provided', HttpStatus.BAD_REQUEST);
    }

    if (itemType !== ORDER_TYPES.PURCHASE && itemType !== ORDER_TYPES.RENTAL) {
      return fail('Invalid item type', HttpStatus.BAD_REQUEST);
    }

    const normalizedItemType: 'purchase' | 'rental' =
      itemType === ORDER_TYPES.PURCHASE
        ? ORDER_TYPES.PURCHASE
        : ORDER_TYPES.RENTAL;

    const [contentInfo] = await db
      .select()
      .from(mediaFiles)
      .where(
        and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)),
      );

    if (!contentInfo) {
      return fail('Content not found', HttpStatus.NOT_FOUND);
    }

    const price =
      normalizedItemType === ORDER_TYPES.PURCHASE
        ? contentInfo.buyPrice
        : contentInfo.rentPrice;

    if (price == null) {
      return fail(
        'Price is not configured for this item',
        HttpStatus.BAD_REQUEST,
      );
    }

    let discountAmount = 0;
    if (couponCode) {
      const couponInfo = await verifyCouponService(
        couponCode,
        contentId,
        collectionId,
      );
      const { discountType, discountValue } = couponInfo.data;
      discountAmount =
        discountType === COUPON_DISCOUNT_TYPE_PERCENTAGE
          ? (Number(price) * discountValue) / 100
          : discountValue;
    }
    const resolvedPrice = Math.max(
      0,
      Math.round((Number(price) - discountAmount) * 100),
    );

    const resolvedCurrency = contentInfo.currency;

    if (resolvedCurrency == null) {
      return fail(
        'Currency is not configured for this item',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newOrder = {
      id: crypto.randomUUID(),
      userId,
      mediaFileId: contentId || null,
      collectionId: collectionId || null,
      itemType: normalizedItemType,
      price: String(price),
      currency: resolvedCurrency,
      status: 'pending' as const,
    };

    if (couponCode && resolvedPrice === 0) {
      const isRental = normalizedItemType === ORDER_TYPES.RENTAL;
      const rentDurationHours = contentInfo.rentDurationHours ?? 0;
      if (isRental && rentDurationHours <= 0) {
        return fail(
          'Rent duration is not configured for this item',
          HttpStatus.BAD_REQUEST,
        );
      }
      const rentExpiresAt = isRental
        ? new Date(Date.now() + rentDurationHours * 60 * 60 * 1000)
        : null;

      await db.transaction(async (tx) => {
        await tx.insert(orders).values({
          ...newOrder,
          collectionId: null,
          price: '0',
          status: ORDER_STATUS.COMPLETED,
          rentExpiresAt,
        });
        await tx.insert(userContentAccess).values({
          id: crypto.randomUUID(),
          orderId: newOrder.id,
          userId,
          mediaFileId: contentId,
          accessType: isRental ? ACCRESS_TYPES.RENTED : ACCRESS_TYPES.PURCHASED,
          rentExpiresAt,
        });
      });

      return success(
        { orderId: newOrder.id, completed: true as const },
        'Order completed successfully',
        HttpStatus.CREATED,
      );
    }

    const [result] = await db.insert(orders).values(newOrder).returning();
    const paymentResult = await createPayment({
      orderId: result.id,
      amount: Number(resolvedPrice),
      currency: resolvedCurrency,
      customerId: userId,
      subscriptionId: subscriptionId ?? undefined,
    });
    return success(
      {
        orderId: result.id,
        url: paymentResult.paymentWindowUrl,
      },
      'Order created successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    logger.error('Error creating content order:', error);
    return fail(
      'Failed to create content order',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
