import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('trending')
  async getTrendingContent() {
    return this.feedService.getTrendingContentService();
  }

  @Get('recent')
  async getRecentContent() {
    return this.feedService.getRecentContentService();
  }
}
