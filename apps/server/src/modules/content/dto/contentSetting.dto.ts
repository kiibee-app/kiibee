import { IsIn, IsOptional, IsString } from 'class-validator';

export const contentSettingsEnumValues = [
  'free',
  'set_password',
  'request_email',
] as const;

export type AccessType = (typeof contentSettingsEnumValues)[number];

export class ContentSettingDto {
  @IsIn(contentSettingsEnumValues)
  accessType!: AccessType;

  @IsOptional()
  @IsString()
  password?: string;
}
