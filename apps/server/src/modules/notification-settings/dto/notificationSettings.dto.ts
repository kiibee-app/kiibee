import { IsEmail, IsIn, IsNotEmpty, ValidateIf } from 'class-validator';

export const notificationSettingTypes = ['overview', 'form', 'sales'] as const;
export const notificationFrequencies = ['monthly', 'weekly', 'daily'] as const;
export const notificationRecipients = ['account_email', 'other_email'] as const;

export type NotificationSettingType = (typeof notificationSettingTypes)[number];
export type NotificationFrequency = (typeof notificationFrequencies)[number];
export type NotificationRecipient = (typeof notificationRecipients)[number];

export class UpdateNotificationSettingsDto {
  @IsIn(notificationSettingTypes)
  type!: NotificationSettingType;

  @IsIn(notificationFrequencies)
  frequency!: NotificationFrequency;

  @IsIn(notificationRecipients)
  recipient!: NotificationRecipient;

  @ValidateIf(
    (payload: UpdateNotificationSettingsDto) =>
      payload.recipient === 'other_email',
  )
  @IsNotEmpty({ message: 'Other email is required' })
  @IsEmail()
  otherEmail?: string;
}
