import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';

export enum ExploreType {
  NEW = 'new',
  TRENDING = 'trending',
  CREATED_FOR_YOU = 'created_for_you',
}

export class ExploreQueryDto {
  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  creatorId?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryId?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contentTypeId?: string[];

  @IsOptional()
  @IsString()
  accessType?: string;

  @IsOptional()
  @IsString()
  minPrice?: string;

  @IsOptional()
  @IsString()
  maxPrice?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(ExploreType)
  type?: ExploreType;
}
