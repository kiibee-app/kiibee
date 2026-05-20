import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @ValidateIf((o) => o.contentTypeId !== 'web')
  @IsString()
  @IsNotEmpty()
  fileKey?: string;

  @ValidateIf((o) => o.contentTypeId === 'web')
  @IsString()
  @IsNotEmpty()
  contentUrl?: string;

  @IsString()
  @IsNotEmpty()
  contentTypeId!: string;

  @IsString()
  @IsNotEmpty()
  collectionId!: string;
}

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  contentUrl?: string;

  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  publishedYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  productionCompany?: string;

  @IsOptional()
  @IsString()
  manufacturerLink?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailLandscapeUrl?: string;

  @IsOptional()
  @IsString()
  visibility?: string;

  @IsOptional()
  @IsString()
  accessType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  buyPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rentPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  rentDurationHours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maximumDownloadCount?: number;

  @IsOptional()
  @IsString()
  physicalProductLink?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDownloadable?: boolean;
}
