import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { viewerPaymentMethods } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { CreatePaymentMethodDto } from '../dto/paymentMethod.dto';
import {
  detectCardBrand,
  hashCardToken,
  parseExpiryDate,
  toPaymentMethodResponse,
} from '../viewerPaymentMethod.helper';

export async function createPaymentMethodService(
  userId: string,
  dto: CreatePaymentMethodDto,
) {
  try {
    const digits = dto.cardNumber.replace(/\D/g, '');
    if (digits.length !== 16) {
      return fail('Card number must be 16 digits', HttpStatus.BAD_REQUEST);
    }

    if (!/^\d{3,4}$/.test(dto.securityCode)) {
      return fail('Invalid security code', HttpStatus.BAD_REQUEST);
    }

    const expiry = parseExpiryDate(dto.expiryDate);
    if (!expiry) {
      return fail('Invalid expiry date', HttpStatus.BAD_REQUEST);
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (
      expiry.year < currentYear ||
      (expiry.year === currentYear && expiry.month < currentMonth)
    ) {
      return fail('Card has expired', HttpStatus.BAD_REQUEST);
    }

    const lastFour = digits.slice(-4);
    const brand = detectCardBrand(digits);
    const cardTokenHash = hashCardToken(digits, userId);

    const created = await db.transaction(async (tx) => {
      const existing = await tx
        .select({ id: viewerPaymentMethods.id })
        .from(viewerPaymentMethods)
        .where(
          and(
            eq(viewerPaymentMethods.userId, userId),
            eq(viewerPaymentMethods.isActive, true),
          ),
        );

      const isFirstCard = existing.length === 0;

      const [inserted] = await tx
        .insert(viewerPaymentMethods)
        .values({
          id: randomUUID(),
          userId,
          brand,
          lastFour,
          cardTokenHash,
          expiryMonth: expiry.month,
          expiryYear: expiry.year,
          isDefault: isFirstCard,
        })
        .returning({
          id: viewerPaymentMethods.id,
          brand: viewerPaymentMethods.brand,
          lastFour: viewerPaymentMethods.lastFour,
          expiryMonth: viewerPaymentMethods.expiryMonth,
          expiryYear: viewerPaymentMethods.expiryYear,
          isDefault: viewerPaymentMethods.isDefault,
        });

      return inserted;
    });

    return success(
      toPaymentMethodResponse(created),
      'Payment method added successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error('Failed to create payment method:', error);
    return fail(
      'Failed to create payment method',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
