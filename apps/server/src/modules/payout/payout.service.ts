import { Injectable } from '@nestjs/common';
import { getSettlementHistoryService } from './services/getSettlementHistory.service';
import { getPayoutStatsService } from './services/getPayoutStats.service';
import { SettlementHistoryQueryDto } from './dto/payout.dto';
import { createPayoutService } from './services/createPayout.service';
import { handlePayoutWebhookService } from './hooks/payoutWebhook';

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
    paymentMethodId: string,
  ) {
    return createPayoutService(creatorId, amount, paymentMethodId);
  }

  async handlePayoutWebhookService(payload: any) {
    return handlePayoutWebhookService(payload);
  }
}
