import { HttpStatus } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { viewerPaymentMethods } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export async function deletePaymentMethodService(
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

    await db.transaction(async (tx) => {
      await tx
        .update(viewerPaymentMethods)
        .set({ isActive: false, isDefault: false })
        .where(eq(viewerPaymentMethods.id, paymentMethodId));

      if (existing.isDefault) {
        const [nextDefault] = await tx
          .select({ id: viewerPaymentMethods.id })
          .from(viewerPaymentMethods)
          .where(
            and(
              eq(viewerPaymentMethods.userId, userId),
              eq(viewerPaymentMethods.isActive, true),
            ),
          )
          .orderBy(asc(viewerPaymentMethods.createdAt))
          .limit(1);

        if (nextDefault) {
          await tx
            .update(viewerPaymentMethods)
            .set({ isDefault: true })
            .where(eq(viewerPaymentMethods.id, nextDefault.id));
        }
      }
    });

    return success(null, 'Payment method deleted successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Failed to delete payment method:', error);
    return fail(
      'Failed to delete payment method',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
