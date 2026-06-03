import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ExploreQueryDto } from './dto/exploreQuery.dto';

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

  @Post('explore')
  async explore(@Query() query: ExploreQueryDto, @Body() body: any) {
    return this.feedService.exploreService(
      query.limit ? Number(query.limit) : 12,
      query.search,
      body,
    );
  }
}
