import { Injectable } from '@nestjs/common';
import { getAllSubscriptionPlansService } from './services/getAllSubscriptionPlans.service';
import { createSubscriptionService } from './services/createSubscription.service';
import { getCreatorPlan } from './services/getCreatorPlan.service';

@Injectable()
export class SubscriptionService {
  Constructor() {}

  async getAllSubscriptionPlans() {
    return getAllSubscriptionPlansService();
  }

  async createSubscription(userId: string, planId: string) {
    const result = await createSubscriptionService({ userId, planId });
    return result;
  }

  async getCreatorPlan(creatorId: string) {
    const result = await getCreatorPlan(creatorId);
    return result;
  }
}
