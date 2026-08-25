import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatorService } from './creator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateCreatorVisibilityDto } from './dto/updateCreatorVisibility.dto';

@Controller('creators')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get()
  async getExploreCreators(
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    if ((limit == null || limit === '') && (search == null || search === '')) {
      return this.creatorService.getExploreCreators();
    }

    const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;
    const safeLimit =
      parsedLimit && Number.isFinite(parsedLimit) ? parsedLimit : 6;

    return this.creatorService.getExploreCreators(
      limit ? safeLimit : undefined,
      search?.trim() || undefined,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/all-creators')
  async getAdminCreators(
    @Query('search') search?: string,
    @Query('plan') plan?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.creatorService.getAdminCreators({
      search: search?.trim() || undefined,
      plan: plan?.trim() || undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/:id/visibility')
  async updateCreatorVisibility(
    @Param('id') id: string,
    @Body() body: UpdateCreatorVisibilityDto,
  ) {
    return this.creatorService.updateCreatorVisibility(id, body.isHidden);
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
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy')
    sortBy?: 'name' | 'subscriberCount' | 'newest' | 'top' | 'featured',
    @Query('search') search?: string,
  ) {
    const parsedPage = page ? Number.parseInt(page, 10) : undefined;
    const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;

    return this.creatorService.getAllCreators({
      page: Number.isFinite(parsedPage) ? parsedPage : undefined,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
      sortBy: sortBy ?? 'name',
      search: search?.trim() || undefined,
    });
  }
}
