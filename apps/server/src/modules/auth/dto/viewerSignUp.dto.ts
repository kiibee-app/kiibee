import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Validate } from 'class-validator';
import { MatchPassword } from 'src/validators/password.validator';

export class ViewerSignUpDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsString()
  @MinLength(6)
  @Validate(MatchPassword)
  confirmPassword!: string;
}
