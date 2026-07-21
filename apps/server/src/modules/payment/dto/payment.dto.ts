import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class PaymentTransactionDto {
  @IsString()
  @IsNotEmpty()
  state?: string;

  @IsString()
  @IsNotEmpty()
  reference?: string;

  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @IsString()
  @IsNotEmpty()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodDisplayText?: string;

  @IsString()
  paymentMethodExpiry?: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodSubType?: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodType?: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodId?: string;

  @IsString()
  @IsOptional()
  subscriptionId?: string;
}

export class PaymentWebhookDataDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentTransactionDto)
  transaction?: PaymentTransactionDto;
}

export class PaymentWebhookDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentWebhookDataDto)
  data?: PaymentWebhookDataDto;
}
