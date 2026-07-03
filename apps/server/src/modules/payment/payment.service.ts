import { Injectable } from '@nestjs/common';
import { getUserSavedCard } from './services/getUserSaveCard.service';
import { deleteSubscriptionService } from './services/deleteUserCard.service';
import { setDefaultCard } from './services/setDefaultCard.service';

@Injectable()
export class PaymentService {
  async getUserSavedCard(userId: string) {
    return getUserSavedCard(userId);
  }

  async deleteUserCard(userId: string, subscriptionId: string) {
    return deleteSubscriptionService(userId, subscriptionId);
  }

  async setDefaultCard(userId: string, cardId: string) {
    return setDefaultCard(userId, cardId);
  }
}
