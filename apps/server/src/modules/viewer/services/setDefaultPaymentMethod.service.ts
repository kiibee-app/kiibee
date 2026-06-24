import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { viewerPaymentMethods } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { toPaymentMethodResponse } from '../viewerPaymentMethod.helper';

export async function setDefaultPaymentMethodService(
  userId: string,
  paymentMethodId: string,
) {
  try {
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

    if (existing.isDefault) {
      return success(
        toPaymentMethodResponse(existing),
        'Payment method is already default',
        HttpStatus.OK,
      );
    }

    const updated = await db.transaction(async (tx) => {
      await tx
        .update(viewerPaymentMethods)
        .set({ isDefault: false })
        .where(
          and(
            eq(viewerPaymentMethods.userId, userId),
            eq(viewerPaymentMethods.isActive, true),
          ),
        );

      const [row] = await tx
        .update(viewerPaymentMethods)
        .set({ isDefault: true })
        .where(eq(viewerPaymentMethods.id, paymentMethodId))
        .returning({
          id: viewerPaymentMethods.id,
          brand: viewerPaymentMethods.brand,
          lastFour: viewerPaymentMethods.lastFour,
          expiryMonth: viewerPaymentMethods.expiryMonth,
          expiryYear: viewerPaymentMethods.expiryYear,
          isDefault: viewerPaymentMethods.isDefault,
        });

      return row;
    });

    return success(
      toPaymentMethodResponse(updated),
      'Default payment method updated successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to set default payment method:', error);
    return fail(
      'Failed to set default payment method',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
