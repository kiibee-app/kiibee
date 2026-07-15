import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PayoutService } from './payout.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard, CreatorGuard } from '../auth/guards/admin.guard';
import { SettlementHistoryQueryDto } from './dto/payout.dto';
import { handlePayoutWebhookService } from './hooks/payoutWebhook';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: string;
  };
};

@Controller('payout')
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('settlement-history')
  getSettlementHistory(
    @Req() req: AuthenticatedRequest,
    @Query() query: SettlementHistoryQueryDto,
  ) {
    return this.payoutService.getSettlementHistory(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('stats')
  getPayoutStats(@Req() req: AuthenticatedRequest) {
    return this.payoutService.getPayoutStats(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('create')
  createPayout(
    @Req() req: AuthenticatedRequest,
    @Body('creatorId') creatorId: string,
    @Body('amount') amount: number,
    @Body('payoutId') payoutId: string,
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    return this.payoutService.createPayoutService(
      creatorId,
      amount,
      payoutId,
      paymentMethodId,
    );
  }
  @Post('webhook')
  async payoutNotification(@Body() payload: any) {
    return handlePayoutWebhookService(payload);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('calculate')
  async payoutCalculation(@Req() req: AuthenticatedRequest) {
    return this.payoutService.payoutCalculationService(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Post('request')
  async payoutRequestCalculationService(
    @Req() req: AuthenticatedRequest,
    @Body('amount') amount: number,
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    return this.payoutService.payoutRequestCalculationService(
      req.user.userId,
      amount,
      paymentMethodId,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('requests')
  async getPayoutRequests() {
    return this.payoutService.getPayoutRequestService();
  }
}
