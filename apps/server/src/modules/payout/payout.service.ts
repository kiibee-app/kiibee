import { Injectable } from '@nestjs/common';
import { getSettlementHistoryService } from './services/getSettlementHistory.service';
import { getPayoutStatsService } from './services/getPayoutStats.service';
import {
  AdminPayoutRequestDto,
  SettlementHistoryQueryDto,
  UpsertAdminAccountDetailsDto,
} from './dto/payout.dto';
import { createPayoutService } from './services/createPayout.service';
import { handlePayoutWebhookService } from './hooks/payoutWebhook';
import { payoutCalculationService } from './services/payoutCalculation.service';
import { payoutRequestCalculationService } from './services/createPayoutRequest.service';
import { getPayoutRequestService } from './services/getPayoutReques.service';
import { getPayoutRequestByIdService } from './services/getPayoutRequestById.service';
import { rejectPayoutRequestService } from './services/rejectPayoutRequest.service';
import { getPayoutHistoryByCreatorIdService } from './services/getPayoutHistoryByCreator.service';
import { getAllPayoutHistoryService } from './services/getAllPayoutHistory.service';
import { getCreatorWalletsService } from './services/getCreatorWallets.service';
import { createAdminPayoutRequestService } from './services/createAdminPayoutRequest.service';
import { upsertAdminAccountDetailsService } from './services/upsertAdminAccountDetails.service';

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

  async getPayoutRequestByIdService(requestId: string) {
    return getPayoutRequestByIdService(requestId);
  }

  async rejectPayoutRequestService(requestId: string) {
    return rejectPayoutRequestService(requestId);
  }

  async getPayoutHistoryByCreatorIdService(
    creatorId: string,
    query?: SettlementHistoryQueryDto,
  ) {
    return getPayoutHistoryByCreatorIdService(creatorId, query);
  }

  async getAllPayoutHistoryService(query?: SettlementHistoryQueryDto) {
    return getAllPayoutHistoryService(query);
  }

  async getCreatorWalletsService(query?: SettlementHistoryQueryDto) {
    return getCreatorWalletsService(query);
  }

  async createAdminPayoutRequestService(dto: AdminPayoutRequestDto) {
    return createAdminPayoutRequestService(
      dto.creatorId,
      dto.paymentMethodId,
      dto.amount,
      dto.processImmediately ?? true,
    );
  }

  async upsertAdminAccountDetailsService(
    creatorId: string,
    dto: UpsertAdminAccountDetailsDto,
  ) {
    return upsertAdminAccountDetailsService(creatorId, dto);
  }
}
