import { HttpStatus } from '@nestjs/common';
import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { viewerPaymentMethods } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { toPaymentMethodResponse } from '../viewerPaymentMethod.helper';

export async function getPaymentMethodsService(userId: string) {
  try {
    const rows = await db
      .select({
        id: viewerPaymentMethods.id,
        brand: viewerPaymentMethods.brand,
        lastFour: viewerPaymentMethods.lastFour,
        expiryMonth: viewerPaymentMethods.expiryMonth,
        expiryYear: viewerPaymentMethods.expiryYear,
        isDefault: viewerPaymentMethods.isDefault,
      })
      .from(viewerPaymentMethods)
      .where(
        and(
          eq(viewerPaymentMethods.userId, userId),
          eq(viewerPaymentMethods.isActive, true),
        ),
      )
      .orderBy(
        desc(viewerPaymentMethods.isDefault),
        asc(viewerPaymentMethods.createdAt),
      );

    return success(
      rows.map(toPaymentMethodResponse),
      'Payment methods retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch payment methods:', error);
    return fail(
      'Failed to fetch payment methods',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
