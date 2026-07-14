import { Injectable } from '@nestjs/common';
import { getSettlementHistoryService } from './services/getSettlementHistory.service';
import { getPayoutStatsService } from './services/getPayoutStats.service';
import { SettlementHistoryQueryDto } from './dto/payout.dto';
import { createPayoutService } from './services/createPayout.service';
import { handlePayoutWebhookService } from './hooks/payoutWebhook';
import { payoutCalculationService } from './services/payoutCalculation.service';
import { payoutRequestCalculationService } from './services/createPayoutRequest.service';
import { getPayoutRequestService } from './services/getPayoutReques.service';

@Injectable()
export class PayoutService {
  async getSettlementHistory(
    creatorId: string,
    query?: SettlementHistoryQueryDto,
  ) {
    return getSettlementHistoryService(creatorId, query);
  }

  async getPayoutStats(creatorId: string) {
    return getPayoutStatsService(creatorId);
  }

  async createPayoutService(
    creatorId: string,
    amount: number,
    payoutId: string,
    paymentMethodId: string,
  ) {
    return createPayoutService(creatorId, amount, payoutId, paymentMethodId);
  }

  async handlePayoutWebhookService(payload: any) {
    return handlePayoutWebhookService(payload);
  }

  async payoutCalculationService(creatorId: string) {
    return payoutCalculationService(creatorId);
  }

  async payoutRequestCalculationService(
    creatorId: string,
    amount: number,
    paymentMethodId: string,
  ) {
    return payoutRequestCalculationService(creatorId, amount, paymentMethodId);
  }

  async getPayoutRequestService() {
    return getPayoutRequestService();
  }
}
