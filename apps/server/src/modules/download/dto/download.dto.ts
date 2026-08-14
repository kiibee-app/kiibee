import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class GetDownloadUrlDto {
  @IsNotEmpty()
  @IsString()
  contentId!: string;
}

export class SetDownloadLimitDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  maxLimit!: number;
}
