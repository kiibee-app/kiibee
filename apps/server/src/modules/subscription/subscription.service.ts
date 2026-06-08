import { Injectable } from '@nestjs/common';
import { getAllSubscriptionPlansService } from './services/getAllSubscriptionPlans.service';
import { createSubscriptionService } from './services/createSubscription.service';

@Injectable()
export class SubscriptionService {
  Constructor() {}

  async getAllSubscriptionPlans() {
    return getAllSubscriptionPlansService();
  }

  async createSubscription(userId: string, planId: string) {
    const { data } = await createSubscriptionService({ userId, planId });
    return data;
  }
}
