import { Injectable } from '@nestjs/common';
import { getSettlementHistoryService } from './services/getSettlementHistory.service';
import { getPayoutStatsService } from './services/getPayoutStats.service';
import { SettlementHistoryQueryDto } from './dto/payout.dto';

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
}
