import { IsEmail, IsIn, IsNotEmpty, ValidateIf } from 'class-validator';
import {
  NOTIFICATION_FREQUENCIES,
  NOTIFICATION_RECIPIENT,
  NOTIFICATION_RECIPIENTS,
  NOTIFICATION_SETTING_TYPES,
  type NotificationFrequency,
  type NotificationRecipient,
  type NotificationSettingType,
} from 'src/utils/notification.constant';

export const notificationSettingTypes = NOTIFICATION_SETTING_TYPES;
export const notificationFrequencies = NOTIFICATION_FREQUENCIES;
export const notificationRecipients = NOTIFICATION_RECIPIENTS;

export type {
  NotificationFrequency,
  NotificationRecipient,
  NotificationSettingType,
};

export class UpdateNotificationSettingsDto {
  @IsIn(notificationSettingTypes)
  type!: NotificationSettingType;

  @IsIn(notificationFrequencies)
  frequency!: NotificationFrequency;

  @IsIn(notificationRecipients)
  recipient!: NotificationRecipient;

  @ValidateIf(
    (payload: UpdateNotificationSettingsDto) =>
      payload.recipient === NOTIFICATION_RECIPIENT.OTHER_EMAIL,
  )
  @IsNotEmpty({ message: 'Other email is required' })
  @IsEmail()
  otherEmail?: string;
}
