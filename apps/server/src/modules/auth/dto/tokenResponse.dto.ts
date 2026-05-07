import {
  IsString,
  IsUUID,
  IsEmail,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class UserDto {
  @IsUUID()
  id!: string;

  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsEnum(['viewer', 'creator', 'admin'])
  role!: 'viewer' | 'creator' | 'admin';

  @IsBoolean()
  isEmailVerified!: boolean;

  @IsDateString()
  createdAt!: string;
}

export class TokenResponseDto {
  @IsString()
  accessToken!: string;

  @IsString()
  refreshToken!: string;
}

export class AuthResponseDto extends UserDto {
  @IsString()
  accessToken!: string;

  @IsString()
  refreshToken!: string;
}
