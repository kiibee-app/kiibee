import { Injectable } from '@nestjs/common';
import { getContentPerformanceService } from './services/getContentPerformance.service';
import { getOverviewAnalyticsService } from './services/getOverviewAnalytics.service';

@Injectable()
export class CreatorOverviewService {
  getContentPerformance(creatorId: string) {
    return getContentPerformanceService(creatorId);
  }

  getOverviewAnalytics(creatorId: string, range?: string) {
    return getOverviewAnalyticsService(creatorId, range);
  }
}
