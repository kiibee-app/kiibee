import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BillingHistoryQueryDto, CreateOrderInputDto } from './dto/order.dto';

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
  @Get('billing-history')
  async getBillingHistory(
    @Req() req: any,
    @Query() query: BillingHistoryQueryDto,
  ) {
    const userId = req.user.userId;
    return this.orderService.getBillingHistory(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('billing-history/:billingId')
  async getBillingInvoice(
    @Req() req: any,
    @Param('billingId') billingId: string,
  ) {
    const userId = req.user.userId;
    return this.orderService.getBillingInvoice(userId, billingId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/billing-history/:viewerId')
  async getViewerBillingHistory(
    @Param('viewerId') viewerId: string,
    @Query() query: BillingHistoryQueryDto,
  ) {
    return this.orderService.getBillingHistory(viewerId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getOrderById(@Req() req: any, @Param('orderId') orderId: string) {
    const userId = req.user.userId;
    return this.orderService.getOrderById(userId, orderId);
  }
}
