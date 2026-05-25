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
}
