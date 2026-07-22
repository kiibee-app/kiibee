import {
  Allow,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateCreatorProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @Allow()
  avatarUrl?: string | null;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  cvr?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  regNumber?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;
}
