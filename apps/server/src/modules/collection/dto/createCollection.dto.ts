import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  visibility?: 'public' | 'hidden' | 'draft' | 'private';

  @IsOptional()
  accessType?: 'free' | 'paid' | 'password' | 'email_gated';

  @IsOptional()
  @IsNumber()
  buyPrice?: number;

  @IsOptional()
  @IsNumber()
  rentPrice?: number;

  @IsOptional()
  @IsString()
  rentDuration?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
