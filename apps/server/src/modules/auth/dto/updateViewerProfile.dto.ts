import { Allow, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateViewerProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Allow()
  avatarUrl?: string | null;
}
