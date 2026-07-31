import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SettlementHistoryQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'completed', 'rejected'])
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class AdminPayoutRequestDto {
  @IsString()
  @IsNotEmpty()
  creatorId!: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(8.01)
  amount?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  processImmediately?: boolean;
}
