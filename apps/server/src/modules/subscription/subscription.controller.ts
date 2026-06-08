import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

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
}
