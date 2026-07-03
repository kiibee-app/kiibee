import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Req() req: any) {
    const auth = req.headers['authorization'];

    if (auth !== `Bearer ${process.env.JWT_ACCESS_SECRET}`) {
      throw new HttpException('Unauthorized webhook', HttpStatus.UNAUTHORIZED);
    }

    await handleEpayPayment(body);

    return { received: true };
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
}
