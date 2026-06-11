import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { orders } from 'src/database/schema/commerce/orders.schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export async function getOrderByIdService(userId: string, orderId: string) {
  try {
    if (!orderId) {
      return fail('orderId must be provided', HttpStatus.BAD_REQUEST);
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
      .limit(1);

    if (!order) {
      return fail('Order not found', HttpStatus.NOT_FOUND);
    }

    return success(order, 'Order fetched successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Failed to fetch order by id:', error);
    return fail('Failed to fetch order', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
