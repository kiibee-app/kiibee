import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { ExploreQueryDto } from './dto/exploreQuery.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('trending')
  async getTrendingContent(@Req() req: any) {
    return this.feedService.getTrendingContentService(req.user?.userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('recent')
  async getRecentContent(@Req() req: any) {
    return this.feedService.getRecentContentService(req.user?.userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('explore')
  async explore(
    @Req() req: any,
    @Query() query: ExploreQueryDto,
    @Body() body: any,
  ) {
    return this.feedService.exploreService(
      query.limit ? Number(query.limit) : 12,
      query.search,
      body,
      query.type,
      req.user?.userId,
    );
  }
}
