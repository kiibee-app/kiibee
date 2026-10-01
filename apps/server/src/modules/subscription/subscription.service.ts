import { Injectable } from '@nestjs/common';
import { getAllSubscriptionPlansService } from './services/getAllSubscriptionPlans.service';
import { createSubscriptionService } from './services/createSubscription.service';
import { getCreatorPlan } from './services/getCreatorPlan.service';
import { deleteSubscriptionService } from './services/deleteSubscription.service';
import { adminGetCreatorPlan } from './services/adminGetCreatorPlan.service';
import { adminUpdateCreatorPlan } from './services/adminUpdateCreatorPlan.service';

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

  async deleteSubscriptionService(userId: string) {
    const result = await deleteSubscriptionService(userId);
    return result;
  }

  async getAdminCreatorPlan(creatorId: string) {
    return adminGetCreatorPlan(creatorId);
  }

  async updateAdminCreatorPlan(creatorId: string, input: any) {
    return adminUpdateCreatorPlan(creatorId, input);
  }
}
