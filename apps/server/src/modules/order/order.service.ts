import { Injectable } from '@nestjs/common';
import { getBillingHistoryService } from './services/getBillingHistory.service';
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
  async getBillingHistory(userId: string) {
    return getBillingHistoryService(userId);
  }
}
