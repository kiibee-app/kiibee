import { BadRequestException } from '@nestjs/common';
import { PLATFORM_FEE_PERCENTAGES } from './fees';

type PayoutFeeOptions = {
  amount: number;
  basePlanPrice: number;
  transactionFeePct?: number | null;
  platformFeePct?: number | null;
  fixedPlatformFee?: number | null;
  currency?: string;
  fallbackPlatformPercentage?: number;
};
const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export function calculatePayoutFees({
  amount,
  basePlanPrice,
  transactionFeePct,
  platformFeePct,
  fixedPlatformFee = null,
  currency = 'DKK',
  fallbackPlatformPercentage = PLATFORM_FEE_PERCENTAGES[0],
}: PayoutFeeOptions) {
  if (!Number.isFinite(amount) || amount <= 0)
    throw new BadRequestException('Invalid payout amount');
  if (
    transactionFeePct != null &&
    (!Number.isFinite(transactionFeePct) ||
      transactionFeePct < 0 ||
      transactionFeePct > 100)
  )
    throw new BadRequestException('Invalid transaction fee percentage');
  if (
    platformFeePct != null &&
    (!Number.isFinite(platformFeePct) ||
      platformFeePct < 0 ||
      platformFeePct > 100)
  )
    throw new BadRequestException('Invalid platform fee percentage');
  if (platformFeePct != null) fixedPlatformFee = null;
  if (
    fixedPlatformFee != null &&
    (!Number.isFinite(fixedPlatformFee) || fixedPlatformFee < 0)
  )
    throw new BadRequestException('Invalid fixed platform fee');
  if (fixedPlatformFee != null && fixedPlatformFee > 0 && currency !== 'DKK')
    throw new BadRequestException(
      'A fixed DKK platform fee requires a DKK payout',
    );
  const platformFeePercentage =
    platformFeePct != null
      ? platformFeePct / 100
      : fixedPlatformFee != null
        ? 0
        : (PLATFORM_FEE_PERCENTAGES[basePlanPrice] ??
          fallbackPlatformPercentage);
  const processingFeePercentage =
    transactionFeePct != null ? transactionFeePct / 100 : 0.05;
  const platformFee = roundMoney(
    fixedPlatformFee ?? amount * platformFeePercentage,
  );
  const processingFee = roundMoney(amount * processingFeePercentage);
  const payableAmount = roundMoney(amount - platformFee - processingFee);
  if (payableAmount < 1)
    throw new BadRequestException('Minimum net payout amount is 1 DKK');
  return {
    platformFeePercentage,
    processingFeePercentage,
    platformFee,
    processingFee,
    payableAmount,
    fixedPlatformFee,
  };
}
