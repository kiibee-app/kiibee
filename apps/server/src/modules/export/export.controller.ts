import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { ExportService } from './export.service';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: string;
  };
};

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Post('request')
  requestExport(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: {
      type: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    return this.exportService.requestExport(
      req.user.userId,
      body.type,
      body.startDate,
      body.endDate,
    );
  }
}
