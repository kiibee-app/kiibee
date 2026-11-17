import { Injectable } from '@nestjs/common';
import { getTrendingContentService } from './services/getTrendingContent.service';
import { getRecentContentService } from './services/getRecentContent.service';
import { exploreService } from './services/explore.service';
import { ExploreType } from './dto/exploreQuery.dto';

@Injectable()
export class FeedService {
  async getTrendingContentService(viewerId?: string) {
    return getTrendingContentService(undefined, viewerId);
  }

  async getRecentContentService(viewerId?: string) {
    return getRecentContentService(undefined, viewerId);
  }

  async exploreService(
    limit?: number,
    search?: string,
    filter?: any,
    type?: ExploreType,
    viewerId?: string,
  ) {
    return exploreService(limit, search, filter, type, viewerId);
  }
}
