import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { DownloadService } from './download.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CheckMediaAccessGuard } from 'src/middleware/CheckMediaAccess';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @UseGuards(JwtAuthGuard)
  @Get('limit')
  async getContentDownloadLimitService() {
    return this.downloadService.getDownloadLimit();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('limit/set')
  async setContentDownloadLimitService(@Body('maxLimit') maxLimit: number) {
    return this.downloadService.setDownloadLimit(maxLimit);
  }

  @UseGuards(JwtAuthGuard, CheckMediaAccessGuard)
  @Get('url')
  async getDownloadUrl(
    @Req() req: Request & { user: { userId: string } },
    @Query('contentId') contentId: string,
  ) {
    const userId = req.user.userId;

    return this.downloadService.getDownloadUrl(userId, contentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('content-info')
  async getContentDownloadInfo(
    @Req() req: Request & { user: { userId: string } },
    @Query('contentId') contentId: string,
  ) {
    const userId = req.user.userId;

    return this.downloadService.getContentDownloadInfo(contentId, userId);
  }
}
