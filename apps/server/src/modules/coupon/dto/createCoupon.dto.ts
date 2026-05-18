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
import {
  COUPON_DISCOUNT_TYPES,
  COUPON_STATUSES,
  type CouponDiscountType,
  type CouponStatus,
} from 'src/utils/coupon';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsIn(COUPON_DISCOUNT_TYPES)
  discountType!: CouponDiscountType;

  @IsNumberString()
  discountValue!: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsString()
  @IsIn(COUPON_STATUSES)
  status?: CouponStatus;

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
