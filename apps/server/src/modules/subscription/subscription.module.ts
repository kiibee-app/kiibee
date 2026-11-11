import { ManualPlanExpiryScheduler } from './manual-plan-expiry.scheduler';
import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, ManualPlanExpiryScheduler],
})
export class SubscriptionModule {}
