import { getProfilePaymentState } from 'src/utils/profilePayment';
import { completeZeroOrder } from './completeZeroOrder';
import { db } from 'src/database/db';
import { CreateOrderInputDto } from '../dto/order.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { logger } from 'src/logger/logger';
import { HttpException } from '@nestjs/common';
import { fail, success } from 'src/utils/sendResponse';
import { mediaFiles } from 'src/database/schema';
import { orders } from 'src/database/schema/commerce/orders.schema';
import { and, eq } from 'drizzle-orm';
import { createPayment } from 'src/modules/payment/services/createPayment.service';
import { ORDER_STATUS, ORDER_TYPES } from 'src/utils/constant';
import { COUPON_DISCOUNT_TYPE_PERCENTAGE } from 'src/utils/coupon';
import { verifyCouponService } from 'src/modules/coupon/services/verifyCoupon.service';
import { findOrCreateCheckoutOrder } from './orderIdempotency';

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

    const channel = await getProfilePaymentState(contentInfo.creatorId, userId);
    if (channel.required)
      return fail(
        channel.hasAccess
          ? 'You already have channel access'
          : 'Purchase a channel pass to access this content',
        HttpStatus.CONFLICT,
      );

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
      collectionId: null,
      itemType: normalizedItemType,
      price: String(resolvedPrice / 100),
      currency: resolvedCurrency,
      status: 'pending' as const,
      idempotencyKey: dto.idempotencyKey?.trim() || null,
    };

    if (couponCode && resolvedPrice === 0) {
      const { order } = await findOrCreateCheckoutOrder(newOrder);
      const result = await completeZeroOrder(
        order.id,
        userId,
        contentInfo.rentDurationHours,
      );
      return success(
        result,
        'Order completed successfully',
        HttpStatus.CREATED,
      );
    }

    const { order } = await findOrCreateCheckoutOrder(newOrder);

    if (order.status === 'refunded') {
      return fail('Order has been refunded', HttpStatus.CONFLICT);
    }

    if (order.status === ORDER_STATUS.COMPLETED) {
      return success(
        { orderId: order.id, completed: true as const },
        'Order already completed',
        HttpStatus.OK,
      );
    }

    const paymentResult = await createPayment({
      orderId: order.id,
      amount: Math.round(Number(order.price) * 100),
      currency: order.currency ?? resolvedCurrency,
      customerId: userId,
      subscriptionId: subscriptionId ?? undefined,
    });
    return success(
      {
        orderId: order.id,
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
