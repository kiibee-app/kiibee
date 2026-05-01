import { Controller, Get } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async getAllSubscriptionPlans() {
    return this.subscriptionService.getAllSubscriptionPlans();
  }
}
