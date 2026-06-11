import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderInputDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createOrder(@Req() req: any, @Body() dto: CreateOrderInputDto) {
    const userId = req.user.userId;
    return this.orderService.createOrder(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getOrderById(@Req() req: any, @Param('orderId') orderId: string) {
    const userId = req.user.userId;
    return this.orderService.getOrderById(userId, orderId);
  }
}
