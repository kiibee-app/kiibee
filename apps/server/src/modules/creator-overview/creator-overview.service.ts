import { Injectable } from '@nestjs/common';
import { getContentPerformanceService } from './services/getContentPerformance.service';

@Injectable()
export class CreatorOverviewService {
  getContentPerformance(creatorId: string) {
    return getContentPerformanceService(creatorId);
  }
}
