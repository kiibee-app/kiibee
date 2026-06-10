import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { CreatorOverviewService } from './creator-overview.service';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: string;
  };
};

@Controller('creator-overview')
export class CreatorOverviewController {
  constructor(
    private readonly creatorOverviewService: CreatorOverviewService,
  ) {}

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('content-performance')
  getContentPerformance(@Req() req: AuthenticatedRequest) {
    return this.creatorOverviewService.getContentPerformance(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('analytics')
  getOverviewAnalytics(
    @Req() req: AuthenticatedRequest,
    @Query('range') range?: string,
  ) {
    return this.creatorOverviewService.getOverviewAnalytics(
      req.user.userId,
      range,
    );
  }
}
