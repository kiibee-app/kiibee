import { IsEmail, IsIn, IsOptional, ValidateIf } from 'class-validator';

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

  @IsOptional()
  @ValidateIf((payload: UpdateNotificationSettingsDto) => {
    return payload.recipient === 'other_email' && Boolean(payload.otherEmail);
  })
  @IsEmail()
  otherEmail?: string;
}
