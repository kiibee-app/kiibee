import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { viewerPaymentMethods } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { UpdatePaymentMethodDto } from '../dto/paymentMethod.dto';
import {
  detectCardBrand,
  hashCardToken,
  parseExpiryDate,
  toPaymentMethodResponse,
} from '../viewerPaymentMethod.helper';

export async function updatePaymentMethodService(
  userId: string,
  paymentMethodId: string,
  dto: UpdatePaymentMethodDto,
) {
  try {
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

    const [existing] = await db
      .select()
      .from(viewerPaymentMethods)
      .where(
        and(
          eq(viewerPaymentMethods.id, paymentMethodId),
          eq(viewerPaymentMethods.userId, userId),
          eq(viewerPaymentMethods.isActive, true),
        ),
      );

    if (!existing) {
      return fail('Payment method not found', HttpStatus.NOT_FOUND);
    }

    const digits = dto.cardNumber?.replace(/\D/g, '') ?? '';
    const updates: Partial<typeof viewerPaymentMethods.$inferInsert> = {
      expiryMonth: expiry.month,
      expiryYear: expiry.year,
    };

    if (digits) {
      if (digits.length !== 16) {
        return fail('Card number must be 16 digits', HttpStatus.BAD_REQUEST);
      }

      updates.lastFour = digits.slice(-4);
      updates.brand = detectCardBrand(digits);
      updates.cardTokenHash = hashCardToken(digits, userId);
    }

    const [updated] = await db
      .update(viewerPaymentMethods)
      .set(updates)
      .where(eq(viewerPaymentMethods.id, paymentMethodId))
      .returning({
        id: viewerPaymentMethods.id,
        brand: viewerPaymentMethods.brand,
        lastFour: viewerPaymentMethods.lastFour,
        expiryMonth: viewerPaymentMethods.expiryMonth,
        expiryYear: viewerPaymentMethods.expiryYear,
        isDefault: viewerPaymentMethods.isDefault,
      });

    return success(
      toPaymentMethodResponse(updated),
      'Payment method updated successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to update payment method:', error);
    return fail(
      'Failed to update payment method',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
