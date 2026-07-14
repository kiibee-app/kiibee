import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { collections, orders } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { verifyCouponService } from 'src/modules/coupon/services/verifyCoupon.service';
import { createPayment } from 'src/modules/payment/services/createPayment.service';
import { ORDER_TYPES } from 'src/utils/constant';
import { COUPON_DISCOUNT_TYPE_PERCENTAGE } from 'src/utils/coupon';
import { parseRentDurationToHours } from 'src/utils/rentDuration';
import { fail, success } from 'src/utils/sendResponse';
import { CreateCollectionOrderInputDto } from '../dto/order.dto';

const COLLECTION_CURRENCY = 'DKK';

const calculateDiscountAmount = async (
  couponCode: string | undefined,
  collectionId: string,
  price: number,
) => {
  if (!couponCode) return 0;

  const couponInfo = await verifyCouponService(
    couponCode,
    undefined,
    collectionId,
  );
  const discountValue = Number(couponInfo.data.discountValue) || 0;

  if (couponInfo.data.discountType === COUPON_DISCOUNT_TYPE_PERCENTAGE) {
    return (price * discountValue) / 100;
  }

  return discountValue;
};

export async function createCollectionOrderService(
  userId: string,
  dto: CreateCollectionOrderInputDto,
) {
  try {
    const { collectionId, itemType, couponCode, subscriptionId } = dto;

    if (!collectionId) {
      return fail('collectionId must be provided', HttpStatus.BAD_REQUEST);
    }

    if (itemType !== ORDER_TYPES.PURCHASE && itemType !== ORDER_TYPES.RENTAL) {
      return fail('Invalid item type', HttpStatus.BAD_REQUEST);
    }

    const normalizedItemType: 'purchase' | 'rental' =
      itemType === ORDER_TYPES.PURCHASE
        ? ORDER_TYPES.PURCHASE
        : ORDER_TYPES.RENTAL;

    const [collectionInfo] = await db
      .select()
      .from(collections)
      .where(
        and(eq(collections.id, collectionId), eq(collections.isDeleted, false)),
      )
      .limit(1);

    if (!collectionInfo) {
      return fail('Collection not found', HttpStatus.NOT_FOUND);
    }

    const price =
      normalizedItemType === ORDER_TYPES.PURCHASE
        ? collectionInfo.buyPrice
        : collectionInfo.rentPrice;

    if (price == null) {
      return fail(
        'Price is not configured for this collection',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      normalizedItemType === ORDER_TYPES.RENTAL &&
      !parseRentDurationToHours(collectionInfo.rentDuration)
    ) {
      return fail(
        'Rent duration is not configured for this collection',
        HttpStatus.BAD_REQUEST,
      );
    }

    const numericPrice = Number(price);
    const discountAmount = await calculateDiscountAmount(
      couponCode,
      collectionId,
      numericPrice,
    );
    const resolvedPrice = Math.max(0, numericPrice - discountAmount) * 100;

    const newOrder = {
      id: crypto.randomUUID(),
      userId,
      mediaFileId: null,
      collectionId,
      itemType: normalizedItemType,
      price: String(resolvedPrice),
      currency: COLLECTION_CURRENCY,
      status: 'pending' as const,
    };

    const [result] = await db.insert(orders).values(newOrder).returning();
    const paymentResult = await createPayment({
      orderId: result.id,
      amount: Number(resolvedPrice),
      currency: COLLECTION_CURRENCY,
      customerId: userId,
      subscriptionId: subscriptionId ?? undefined,
    });

    return success(
      {
        orderId: result.id,
        url: paymentResult.paymentWindowUrl,
      },
      'Collection order created successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Error creating collection order:', error);
    return fail(
      'Failed to create collection order',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
