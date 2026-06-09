import { IsOptional, IsIn, IsString, MaxLength } from 'class-validator';
import { layoutEnumValues } from 'src/database/schema/enums';

export type LayoutType = (typeof layoutEnumValues)[number];

export class ContentAppearanceDto {
  @IsOptional()
  @IsIn(layoutEnumValues)
  layout?: LayoutType;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  textColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  buttonColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  logoName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  logoType?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  receipt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  supportEmail?: string;

  @IsOptional()
  @IsString()
  desktopCoverImageUrl?: string;

  @IsOptional()
  @IsString()
  mobileCoverImageUrl?: string;
}
