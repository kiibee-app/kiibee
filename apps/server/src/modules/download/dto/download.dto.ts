import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class GetDownloadUrlDto {
  @IsNotEmpty()
  @IsString()
  contentId!: string;
}

export class SetDownloadLimitDto {
  @IsInt()
  @Min(0)
  @Max(10)
  maxLimit!: number;
}

export class SetStreamLimitDto {
  @IsInt()
  @Min(1)
  @Max(10)
  maxStreamLimit!: number;
}
