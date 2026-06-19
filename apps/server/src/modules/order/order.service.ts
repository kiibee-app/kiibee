import { Injectable } from '@nestjs/common';
import { getBillingHistoryService } from './services/getBillingHistory.service';
import { getBillingInvoiceService } from './services/getBillingInvoice.service';
import { createOrderService } from './services/createOrder.service';
import { BillingHistoryQueryDto, CreateOrderInputDto } from './dto/order.dto';
import { getOrderByIdService } from './services/getOrderById.service';

@Injectable()
export class OrderService {
  async createOrder(userId: string, dto: CreateOrderInputDto) {
    return createOrderService(userId, dto);
  }

  async getOrderById(userId: string, orderId: string) {
    return getOrderByIdService(userId, orderId);
  }

  async getBillingHistory(userId: string, query?: BillingHistoryQueryDto) {
    return getBillingHistoryService(userId, query);
  }

  async getBillingInvoice(userId: string, billingId: string) {
    return getBillingInvoiceService(userId, billingId);
  }
}
