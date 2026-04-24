import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateCreatorApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  cvr?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postalCode!: string;

  @IsString()
  @IsUrl()
  exampleWorkLink!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  contentDescription!: string;
}
