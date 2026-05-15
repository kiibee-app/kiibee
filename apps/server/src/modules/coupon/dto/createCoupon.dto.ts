import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumberString,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsIn(['fixed_amount', 'percentage'])
  discountType!: 'fixed_amount' | 'percentage';

  @IsNumberString()
  discountValue!: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'completed'])
  status?: 'active' | 'inactive' | 'completed';

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number;
}
