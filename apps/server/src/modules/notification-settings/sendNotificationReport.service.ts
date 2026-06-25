import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { notificationSettings, users } from 'src/database/schema';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { formatUserDisplayName } from 'src/modules/creator-users/creator-users.helper';
import { runInBackground } from 'src/utils/backgroundTask';
import {
  buildNotificationReportVariables,
  getNotificationMailSubject,
  getNotificationTemplateName,
  resolveNotificationRecipientEmail,
} from './buildNotificationReportData';
import {
  isScheduledRunDay,
  shouldSendForFrequency,
} from './notification-report.helper';

@Injectable()
export class NotificationReportService {
  private readonly logger = new Logger(NotificationReportService.name);

  async sendReportForUser(
    userId: string,
    options?: { ignoreSchedule?: boolean },
  ) {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [settings] = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId))
      .limit(1);

    const effectiveSettings = settings ?? {
      type: 'overview' as const,
      frequency: 'monthly' as const,
      recipient: 'account_email' as const,
      otherEmail: null,
      lastSentAt: null,
    };

    if (
      !options?.ignoreSchedule &&
      !isScheduledRunDay(effectiveSettings.frequency, new Date())
    ) {
      return { sent: false, reason: 'not_scheduled_today' as const };
    }

    if (
      !options?.ignoreSchedule &&
      !shouldSendForFrequency(
        effectiveSettings.frequency,
        effectiveSettings.lastSentAt,
      )
    ) {
      return { sent: false, reason: 'already_sent_for_period' as const };
    }

    const recipientEmail = resolveNotificationRecipientEmail(
      effectiveSettings.recipient,
      user.email,
      effectiveSettings.otherEmail,
    );

    if (!recipientEmail) {
      return { sent: false, reason: 'missing_other_email' as const };
    }

    const displayName = formatUserDisplayName(user);
    const variables = await buildNotificationReportVariables(
      userId,
      effectiveSettings.type,
      effectiveSettings.frequency,
      displayName,
    );

    const sent = await sendTemplateEmail({
      to: recipientEmail,
      subject: getNotificationMailSubject(
        effectiveSettings.type,
        variables.periodLabel as string,
      ),
      templateName: getNotificationTemplateName(effectiveSettings.type),
      variables,
    });

    if (!sent) {
      return { sent: false, reason: 'email_failed' as const };
    }

    if (settings) {
      await db
        .update(notificationSettings)
        .set({ lastSentAt: new Date(), updatedAt: new Date() })
        .where(eq(notificationSettings.userId, userId));
    }

    return {
      sent: true,
      to: recipientEmail,
      type: effectiveSettings.type,
      frequency: effectiveSettings.frequency,
      periodLabel: variables.periodLabel,
    };
  }

  sendReportForUserInBackground(userId: string) {
    runInBackground(this.sendReportForUser(userId, { ignoreSchedule: true }), {
      name: `notification-report:${userId}`,
      onError: (error) => {
        this.logger.error(
          `Failed to send notification report for ${userId}`,
          error,
        );
      },
    });
  }

  async sendScheduledReports() {
    const allSettings = await db.select().from(notificationSettings);
    let sentCount = 0;

    for (const settings of allSettings) {
      try {
        const result = await this.sendReportForUser(settings.userId);
        if (result.sent) {
          sentCount += 1;
          this.logger.log(
            `Sent ${settings.type} report to user ${settings.userId} (${result.periodLabel})`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed scheduled notification report for user ${settings.userId}`,
          error,
        );
      }
    }

    return { processed: allSettings.length, sentCount };
  }
}
