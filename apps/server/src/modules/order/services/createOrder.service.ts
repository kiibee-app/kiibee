import { db } from 'src/database/db';
import { orders } from 'src/database/schema/commerce/orders.schema';
import { CreateOrderInputDto } from '../dto/order.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { logger } from 'src/logger/logger';
import { BadRequestException } from '@nestjs/common';
import { fail, success } from 'src/utils/sendResponse';
import { mediaFiles } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { createPayment } from 'src/modules/payment/services/createPayment.service';
import { ORDER_TYPES } from 'src/utils/constant';

export async function createOrderService(
  userId: string,
  dto: CreateOrderInputDto,
) {
  try {
    const { contentId, collectionId, itemType } = dto;

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
      .where(eq(mediaFiles.id, contentId));

    if (!contentInfo) {
      return fail('Content not found', HttpStatus.NOT_FOUND);
    }

    const resolvedPrice =
      normalizedItemType === ORDER_TYPES.PURCHASE
        ? contentInfo.buyPrice
        : contentInfo.rentPrice;

    if (resolvedPrice == null) {
      return fail(
        'Price is not configured for this item',
        HttpStatus.BAD_REQUEST,
      );
    }

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
      price: resolvedPrice,
      currency: resolvedCurrency,
      status: 'pending' as const,
    };

    const [result] = await db.insert(orders).values(newOrder).returning();
    const paymentResult = await createPayment(
      result.id,
      Number(resolvedPrice),
      resolvedCurrency,
    );

    return success(
      {
        orderId: result.id,
        url: paymentResult.paymentWindowUrl,
      },
      'Order created successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    logger.error('Error assigning user content preferences:', error);
    return fail(
      'Failed to assign user content preferences',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
