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
import { CreatorGuard } from '../auth/guards/admin.guard';
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

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createPayout(
    @Req() req: AuthenticatedRequest,
    @Body('amount') amount: number,
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    return this.payoutService.createPayoutService(
      req.user.userId,
      amount,
      paymentMethodId,
    );
  }
  @Post('webhook')
  async payoutNotification(@Body() payload: any) {
    return handlePayoutWebhookService(payload);
  }
}
