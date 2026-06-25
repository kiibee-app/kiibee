import { BadRequestException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from 'src/database/db';
import { notificationSettings } from 'src/database/schema';
import { UpdateNotificationSettingsDto } from './dto/notificationSettings.dto';

const DEFAULT_NOTIFICATION_SETTINGS = {
  type: 'overview',
  frequency: 'monthly',
  recipient: 'account_email',
  otherEmail: null,
} as const;

@Injectable()
export class NotificationSettingsService {
  async getSettings(userId: string) {
    const [settings] = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId))
      .limit(1);

    return settings ?? { userId, ...DEFAULT_NOTIFICATION_SETTINGS };
  }

  async updateSettings(userId: string, payload: UpdateNotificationSettingsDto) {
    const otherEmail = payload.otherEmail?.trim() || null;

    if (payload.recipient === 'other_email' && !otherEmail) {
      throw new BadRequestException('Other email is required');
    }

    const values = {
      type: payload.type,
      frequency: payload.frequency,
      recipient: payload.recipient,
      otherEmail: payload.recipient === 'other_email' ? otherEmail : null,
      updatedAt: new Date(),
    };

    const [existingSettings] = await db
      .select({ id: notificationSettings.id })
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId))
      .limit(1);

    if (existingSettings) {
      const [updatedSettings] = await db
        .update(notificationSettings)
        .set(values)
        .where(eq(notificationSettings.userId, userId))
        .returning();

      return updatedSettings;
    }

    const [createdSettings] = await db
      .insert(notificationSettings)
      .values({
        id: randomUUID(),
        userId,
        ...values,
      })
      .returning();

    return createdSettings;
  }
}
