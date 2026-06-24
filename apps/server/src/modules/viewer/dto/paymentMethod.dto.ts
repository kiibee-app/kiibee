import { IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  cardNumber!: string;

  @IsString()
  expiryDate!: string;

  @IsString()
  securityCode!: string;
}

export class UpdatePaymentMethodDto {
  @IsOptional()
  @IsString()
  cardNumber?: string;

  @IsString()
  expiryDate!: string;

  @IsString()
  securityCode!: string;
}
