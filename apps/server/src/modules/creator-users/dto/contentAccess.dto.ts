import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RequestContentAccessDto {
  @IsString()
  @IsNotEmpty()
  creatorId!: string;

  @IsString()
  @IsNotEmpty()
  contentId!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;
}

export class ApproveContentAccessDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
