import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { NotificationSettingsService } from './notification-settings.service';
import { NotificationReportService } from './sendNotificationReport.service';
import { UpdateNotificationSettingsDto } from './dto/notificationSettings.dto';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: string;
  };
};

@Controller('notification-settings')
@UseGuards(JwtAuthGuard, CreatorGuard)
export class NotificationSettingsController {
  constructor(
    private readonly notificationSettingsService: NotificationSettingsService,
    private readonly notificationReportService: NotificationReportService,
  ) {}

  @Get()
  getSettings(@Req() req: AuthenticatedRequest) {
    return this.notificationSettingsService.getSettings(req.user.userId);
  }

  @Put()
  updateSettings(
    @Req() req: AuthenticatedRequest,
    @Body() payload: UpdateNotificationSettingsDto,
  ) {
    return this.notificationSettingsService.updateSettings(
      req.user.userId,
      payload,
    );
  }

  @Post('send-test')
  async sendTestReport(@Req() req: AuthenticatedRequest) {
    return this.notificationReportService.sendReportForUser(req.user.userId, {
      ignoreSchedule: true,
    });
  }
}
