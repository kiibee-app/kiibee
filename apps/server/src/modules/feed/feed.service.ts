import { Injectable } from '@nestjs/common';
import { getTrendingContentService } from './services/getTrendingContent.service';
import { getRecentContentService } from './services/getRecentContent.service';
import { exploreService } from './services/explore.service';

@Injectable()
export class FeedService {
  async getTrendingContentService() {
    return getTrendingContentService();
  }

  async getRecentContentService() {
    return getRecentContentService();
  }

  async exploreService(limit?: number, search?: string, filter?: any) {
    return exploreService(limit, search, filter);
  }
}
