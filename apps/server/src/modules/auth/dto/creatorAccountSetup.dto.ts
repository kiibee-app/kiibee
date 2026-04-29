import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
  MinLength,
} from 'class-validator';
import { MatchPassword } from 'src/validators/password.validator';

export class CreatorAccountSetupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  token!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  planId!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  confirmEmail!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsString()
  @MinLength(6)
  @Validate(MatchPassword)
  confirmPassword!: string;
}
