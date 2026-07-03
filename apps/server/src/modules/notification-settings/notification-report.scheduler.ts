import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationReportService } from './sendNotificationReport.service';

@Injectable()
export class NotificationReportScheduler {
  private readonly logger = new Logger(NotificationReportScheduler.name);

  constructor(
    private readonly notificationReportService: NotificationReportService,
  ) {}

  @Cron('0 9 * * *')
  async handleScheduledReports() {
    this.logger.log('Running scheduled notification reports');
    const result = await this.notificationReportService.sendScheduledReports();
    this.logger.log(
      `Notification reports complete: ${result.sentCount}/${result.processed} sent`,
    );
  }
}
