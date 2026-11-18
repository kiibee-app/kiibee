import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsNumber,
  Max,
  MaxLength,
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
  @IsOptional()
  @IsString()
  @MaxLength(500)
  accessBoxText?: string | null;

  @IsIn(contentSettingsEnumValues)
  accessType!: AccessType;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(99999999.99)
  buyPrice?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(99999999.99)
  rentPrice?: number | null;

  @IsOptional()
  @IsIn(['1_month', '3_months', '6_months', '12_months'])
  rentDuration?: string | null;

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
