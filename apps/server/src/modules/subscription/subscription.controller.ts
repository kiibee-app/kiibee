import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { handleSubscriptionPayment } from './hooks/subscriptionPayWebhook';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async getAllSubscriptionPlans() {
    return this.subscriptionService.getAllSubscriptionPlans();
  }

  @Post('create')
  async createSubscription(
    @Body() { userId, planId }: { userId: string; planId: string },
  ) {
    return this.subscriptionService.createSubscription(userId, planId);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Req() req: any) {
    const auth = req.headers['authorization'];

    if (auth !== `Bearer ${process.env.JWT_ACCESS_SECRET}`) {
      throw new HttpException('Unauthorized webhook', HttpStatus.UNAUTHORIZED);
    }

    await handleSubscriptionPayment(body);

    return { received: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('creator/plan')
  async getCreatorPlan(@Req() req: any) {
    const creatorId = req.user.userId;
    return this.subscriptionService.getCreatorPlan(creatorId);
  }
}
