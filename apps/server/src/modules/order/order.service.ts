import { Injectable } from '@nestjs/common';
import { getBillingHistoryService } from './services/getBillingHistory.service';
import { createOrderService } from './services/createOrder.service';
import { CreateOrderInputDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  async createOrder(userId: string, dto: CreateOrderInputDto) {
    return createOrderService(userId, dto);
  }

  async getBillingHistory(userId: string) {
    return getBillingHistoryService(userId);
  }
}
