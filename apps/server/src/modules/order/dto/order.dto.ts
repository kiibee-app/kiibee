import { IsString, IsOptional } from 'class-validator';

export class CreateOrderInputDto {
  @IsString()
  contentId!: string;

  @IsOptional()
  @IsString()
  collectionId?: string;

  @IsString()
  itemType!: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
