import { Module } from '@nestjs/common';
import { NotificationSettingsController } from './notification-settings.controller';
import { NotificationSettingsService } from './notification-settings.service';
import { NotificationReportService } from './sendNotificationReport.service';
import { NotificationReportScheduler } from './notification-report.scheduler';

@Module({
  controllers: [NotificationSettingsController],
  providers: [
    NotificationSettingsService,
    NotificationReportService,
    NotificationReportScheduler,
  ],
})
export class NotificationSettingsModule {}
