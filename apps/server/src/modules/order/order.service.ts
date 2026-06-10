import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { orders } from 'src/database/schema/commerce/orders.schema';
import { completeSuccessfulOrderPayment } from 'src/modules/payment/hooks/paymentWebhook';
import { ORDER_STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';
import { createOrderService } from './services/createOrder.service';
import { CreateOrderInputDto } from './dto/order.dto';
import { getOrderByIdService } from './services/getOrderById.service';

@Injectable()
export class OrderService {
  async createOrder(userId: string, dto: CreateOrderInputDto) {
    return createOrderService(userId, dto);
  }

  async getOrderById(userId: string, orderId: string) {
    return getOrderByIdService(userId, orderId);
  }

  async confirmOrderPayment(userId: string, orderId: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Payment confirmation fallback is disabled');
    }

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

    if (order.status === ORDER_STATUS.COMPLETED) {
      return success(order, 'Order already completed', HttpStatus.OK);
    }

    const updatedOrder = await completeSuccessfulOrderPayment({
      reference: order.id,
      amount: order.price,
      currency: order.currency,
      paymentMethodType: 'epay',
    });

    return success(
      updatedOrder ?? order,
      'Order payment confirmed',
      HttpStatus.OK,
    );
  }
}
