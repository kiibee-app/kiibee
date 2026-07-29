import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PayoutService } from './payout.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard, CreatorGuard } from '../auth/guards/admin.guard';
import {
  AdminPayoutRequestDto,
  SettlementHistoryQueryDto,
} from './dto/payout.dto';
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

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('requests/:id')
  async getPayoutRequestById(@Param('id') id: string) {
    return this.payoutService.getPayoutRequestByIdService(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('requests/:id/reject')
  async rejectPayoutRequest(@Param('id') id: string) {
    return this.payoutService.rejectPayoutRequestService(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('history/:creatorId')
  getPayoutHistory(
    @Req() req: AuthenticatedRequest,
    @Query() query: SettlementHistoryQueryDto,
    @Param('creatorId') creatorId: string,
  ) {
    return this.payoutService.getPayoutHistoryByCreatorIdService(
      creatorId,
      query,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('all-history')
  getAllPayoutHistory(@Query() query: SettlementHistoryQueryDto) {
    return this.payoutService.getAllPayoutHistoryService(query);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('wallets')
  getCreatorWallets(@Query() query: SettlementHistoryQueryDto) {
    return this.payoutService.getCreatorWalletsService(query);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('calculate/:creatorId')
  getAdminPayoutCalculation(@Param('creatorId') creatorId: string) {
    return this.payoutService.payoutCalculationService(creatorId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin-request')
  createAdminPayoutRequest(@Body() body: AdminPayoutRequestDto) {
    return this.payoutService.createAdminPayoutRequestService(body);
  }
}
