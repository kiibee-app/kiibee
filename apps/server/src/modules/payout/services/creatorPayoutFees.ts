import { BadRequestException } from '@nestjs/common';
import { and, asc, eq, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collections,
  creatorPayouts,
  mediaFiles,
  orders,
} from 'src/database/schema';
import { calculatePayoutFees } from 'src/utils/payoutFees';

// Allocate gross withdrawals FIFO to whole paid sales. Never infer a sale count
// from the wallet balance or charge previously withdrawn sales again.
export function countPayoutSales(
  prices: number[],
  withdrawn: number,
  amount: number,
) {
  let skip = Math.round(withdrawn * 100);
  let remaining = Math.round(amount * 100);
  let count = 0;
  for (const price of prices) {
    const cents = Math.round(price * 100);
    if (!Number.isFinite(cents) || cents <= 0) continue;
    if (skip >= cents) {
      skip -= cents;
      continue;
    }
    if (remaining === 0) break;
    if (skip !== 0 || remaining < cents)
      throw new BadRequestException(
        'Per-sale fees require a payout covering whole sales; partial-sale payouts need reconciliation',
      );
    remaining -= cents;
    count++;
  }
  if (skip !== 0 || remaining !== 0 || count === 0)
    throw new BadRequestException(
      'Cannot reconcile payout amount with completed sales',
    );
  return count;
}

export async function calculateCreatorPayoutFees(
  creatorId: string,
  options: Parameters<typeof calculatePayoutFees>[0],
  executor: Pick<typeof db, 'select'> = db,
) {
  if (options.platformFeePct != null || options.fixedPlatformFee == null)
    return calculatePayoutFees(options);

  const [sales, [paid]] = await Promise.all([
    executor
      .select({ price: orders.price })
      .from(orders)
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .where(
        and(
          eq(orders.status, 'completed'),
          eq(orders.currency, options.currency ?? 'DKK'),
          or(
            eq(mediaFiles.creatorId, creatorId),
            eq(collections.creatorId, creatorId),
          ),
        ),
      )
      .orderBy(asc(orders.createdAt), asc(orders.id)),
    executor
      .select({
        amount: sql<string>`coalesce(sum(${creatorPayouts.rawAmount}), 0)`,
      })
      .from(creatorPayouts)
      .where(
        and(
          eq(creatorPayouts.creatorId, creatorId),
          eq(creatorPayouts.currency, options.currency ?? 'DKK'),
          eq(creatorPayouts.status, 'completed'),
        ),
      ),
  ]);
  const withdrawn = Number(paid?.amount ?? 0);
  if (!Number.isFinite(withdrawn) || withdrawn < 0)
    throw new BadRequestException('Invalid historical payout total');
  const saleCount = countPayoutSales(
    sales.map((sale) => Number(sale.price)),
    withdrawn,
    options.amount,
  );
  return calculatePayoutFees({ ...options, saleCount });
}
