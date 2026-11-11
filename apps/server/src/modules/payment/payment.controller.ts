import { AdminGuard } from '../auth/guards/admin.guard';
import { adminBillingHistoryService } from './services/adminBillingHistory.service';
import {
  Body,
  Controller,
  Query,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { handleEpayPayment } from './hooks/paymentWebhook';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { handleAddCardWebhook } from './hooks/cardAddedWebhook';
import { verifyEpayWebhookAuthorization } from 'src/utils/epayWebhookAuth';
import { logger } from 'src/logger/logger';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/billing-history')
  async billingHistory(
    @Query('kind') kind: string,
    @Query('page') page?: string,
  ) {
    return adminBillingHistoryService(kind, page);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() body: any, @Req() req: any) {
    this.assertEpayAuthorization(
      req.headers['authorization'],
      '/api/v1/payment/webhook',
    );

    await handleEpayPayment(body);

    return { received: true };
  }

  @Post('webhook/card')
  @HttpCode(HttpStatus.OK)
  async handleAddCardWebhook(@Body() body: any, @Req() req: any) {
    this.assertEpayAuthorization(
      req.headers['authorization'],
      '/api/v1/payment/webhook/card',
    );

    await handleAddCardWebhook(body);

    return { received: true };
  }

  private assertEpayAuthorization(
    authorization: string | string[] | undefined,
    path: string,
  ) {
    const result = verifyEpayWebhookAuthorization(authorization);

    if (result.authorized) return;

    logger.warn('Rejected ePay webhook authorization', {
      path,
      reason: result.reason,
      hasAuthorization: result.hasAuthorization,
      scheme: result.scheme,
      expectedScheme: result.expectedScheme,
      expectedLength: result.expectedLength,
      expectedCount: result.expectedCount,
      expectedLengths: result.expectedLengths,
      receivedLength: result.receivedLength,
      receivedHasOuterWhitespace: result.receivedHasOuterWhitespace,
      receivedFormat: result.receivedFormat,
    });

    throw new HttpException('Unauthorized webhook', HttpStatus.UNAUTHORIZED);
  }

  @UseGuards(JwtAuthGuard)
  @Get('cards')
  async getUserSavedCard(@Req() req: any) {
    const userId = req.user?.userId;
    return this.paymentService.getUserSavedCard(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('card/:subscriptionId')
  async deleteUserCard(@Req() req: any) {
    const userId = req.user?.userId;
    const subscriptionId = req.params.subscriptionId;
    return this.paymentService.deleteUserCard(userId, subscriptionId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('card/default/:cardId')
  async setDefaultCard(@Req() req: any) {
    const userId = req.user?.userId;
    const cardId = req.params.cardId;
    return this.paymentService.setDefaultCard(userId, cardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('card/add')
  async addNewCard(@Req() req: any) {
    const userId = req.user?.userId;
    return this.paymentService.addNewCard(userId);
  }
}
