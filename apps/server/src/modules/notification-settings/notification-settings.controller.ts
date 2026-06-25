import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { NotificationSettingsService } from './notification-settings.service';
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
}
