import { Allow, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateViewerProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  /** Base64 data URL (image/png, jpeg, webp); null clears the avatar */
  @IsOptional()
  @Allow()
  avatarUrl?: string | null;
}
