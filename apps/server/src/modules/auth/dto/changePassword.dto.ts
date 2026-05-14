import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { MatchPassword } from 'src/validators/password.validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsString()
  @MinLength(6)
  @Validate(MatchPassword)
  confirmPassword!: string;
}
