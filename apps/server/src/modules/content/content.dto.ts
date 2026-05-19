import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @ValidateIf((o) => o.contentTypeId !== 'web')
  @IsString()
  @IsNotEmpty()
  fileKey?: string;

  @ValidateIf((o) => o.contentTypeId === 'web')
  @IsString()
  @IsNotEmpty()
  contentUrl?: string;

  @IsString()
  @IsNotEmpty()
  contentTypeId!: string;

  @IsString()
  @IsNotEmpty()
  collectionId!: string;
}
