import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const contentSettingsEnumValues = [
  'free',
  'set_password',
  'request_email',
  'payment',
  'paid',
] as const;

export type AccessType = (typeof contentSettingsEnumValues)[number];

export class ContentSettingDto {
  @IsIn(contentSettingsEnumValues)
  accessType!: AccessType;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  removePasswordIndexes?: number[];
}
