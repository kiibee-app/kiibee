import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RejectContentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  reason!: string;
}
