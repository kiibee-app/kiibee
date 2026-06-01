import { Controller, Get, Param, Query } from '@nestjs/common';
import { CreatorService } from './creator.service';

@Controller('creators')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get()
  async getExploreCreators(@Query('limit') limit?: string) {
    if (limit == null || limit === '') {
      return this.creatorService.getExploreCreators();
    }

    const parsedLimit = Number.parseInt(limit, 10);
    const safeLimit = Number.isFinite(parsedLimit) ? parsedLimit : 6;

    return this.creatorService.getExploreCreators(safeLimit);
  }

  @Get(':id')
  async getCreatorPublicProfile(@Param('id') id: string) {
    return this.creatorService.getCreatorPublicProfile(id);
  }

  @Get('top')
  async getTopCreators() {
    return this.creatorService.getTopCreators();
  }

  @Get('all')
  async getAllCreators(
    @Query('limit') limit?: string,
    @Query('sortBy')
    sortBy?: 'name' | 'subscriberCount' | 'newest' | 'top' | 'featured',
    @Query('search') search?: string,
  ) {
    const parsedLimit = Number.parseInt(limit ?? '24', 10);

    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 24;

    const safeSortBy = sortBy ?? 'name';

    return this.creatorService.getAllCreators({
      limit: safeLimit,
      sortBy: safeSortBy,
      search: search?.trim() || undefined,
    });
  }
}
