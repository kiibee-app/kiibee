import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class RecentlyViewedItemDto {
  @IsString()
  @MaxLength(255)
  id!: string;

  @IsString()
  @MaxLength(1000)
  title!: string;

  @IsString()
  @MaxLength(2000)
  @Matches(/^\/(?!\/)/)
  href!: string;

  @IsInt()
  @Min(0)
  @Max(8640000000000000)
  viewedAt!: number;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  creatorName?: string;
}

export class SyncRecentlyViewedDto {
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => RecentlyViewedItemDto)
  items!: RecentlyViewedItemDto[];
}
