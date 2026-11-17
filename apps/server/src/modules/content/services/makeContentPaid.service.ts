import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { fail, success } from 'src/utils/sendResponse';

export async function makeContentPaidService(
  contentId: string,
  input: {
    buyPrice?: unknown;
    rentPrice?: unknown;
    rentDurationHours?: unknown;
  },
) {
  const price = (value: unknown) => {
    if (value == null || value === '') return null;
    if (typeof value !== 'number' && typeof value !== 'string')
      throw new HttpException('Invalid price', HttpStatus.BAD_REQUEST);
    const amount = Number(value);
    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 99999999.99 ||
      Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001
    )
      throw new HttpException(
        'Prices must be positive with at most two decimals',
        HttpStatus.BAD_REQUEST,
      );
    return amount.toFixed(2);
  };
  const buyPrice = price(input?.buyPrice);
  const rentPrice = price(input?.rentPrice);
  if (!buyPrice && !rentPrice)
    return fail('Enter a buy price or rent price', HttpStatus.BAD_REQUEST);
  const duration = rentPrice ? Number(input?.rentDurationHours ?? 48) : null;
  if (
    rentPrice &&
    (!Number.isSafeInteger(duration) ||
      duration! <= 0 ||
      duration! > 2147483647)
  )
    return fail(
      'Enter a positive rental duration in hours',
      HttpStatus.BAD_REQUEST,
    );
  const [updated] = await db
    .update(mediaFiles)
    .set({
      accessType: 'paid',
      buyPrice,
      rentPrice,
      rentDurationHours: duration,
      passwordHash: null,
      updatedAt: new Date(),
    })
    .where(and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)))
    .returning();
  if (!updated)
    throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
  return success(updated, 'Content made paid successfully', HttpStatus.OK);
}
