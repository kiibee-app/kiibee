import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

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

  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'idempotencyKey must contain only alphanumeric characters, underscores, or hyphens',
  })
  idempotencyKey?: string;
}
export class CreateCollectionOrderInputDto {
  @IsString()
  collectionId!: string;

  @IsString()
  itemType!: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'idempotencyKey must contain only alphanumeric characters, underscores, or hyphens',
  })
  idempotencyKey?: string;
}

export class BillingHistoryQueryDto {
  @IsOptional()
  @IsString()
  searchContent?: string;

  @IsOptional()
  @IsString()
  searchCreator?: string;
}
