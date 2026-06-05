import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { handleEpayPayment } from './hooks/paymentWebhook';

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
}
