import { Injectable } from '@nestjs/common';
import { getAllSubscriptionPlansService } from './services/getAllSubscriptionPlans.service';

@Injectable()
export class SubscriptionService {
  Constructor() {}

  async getAllSubscriptionPlans() {
    return getAllSubscriptionPlansService();
  }
}
