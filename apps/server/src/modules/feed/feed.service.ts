import { Injectable } from '@nestjs/common';
import { getTrendingContentService } from './services/getTrendingContent.service';
import { getRecentContentService } from './services/getRecentContent.service';

@Injectable()
export class FeedService {
  async getTrendingContentService() {
    return getTrendingContentService();
  }

  async getRecentContentService() {
    return getRecentContentService();
  }
}
