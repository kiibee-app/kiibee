import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { expireManualPlans } from './services/expireManualPlans.service';

@Injectable()
export class ManualPlanExpiryScheduler {
  private readonly logger = new Logger(ManualPlanExpiryScheduler.name);

  @Cron('* * * * *')
  async expirePlans() {
    try {
      await expireManualPlans();
    } catch (error) {
      this.logger.error('Failed to expire manual plans', error);
    }
  }
}
