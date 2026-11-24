import { BadRequestException } from '@nestjs/common';
import { and, asc, eq, isNull, isNotNull, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collections,
  creatorWallets,
  mediaFiles,
  orders,
  payments,
} from 'src/database/schema';
import { calculatePayoutFees } from 'src/utils/payoutFees';

// Count actual paid orders and use the wallet only to identify outstanding
// FIFO credits. Historical payout gross fields are not a payment ledger.
function selectPayoutSales(
  prices: number[],
  withdrawn: number,
  amount: number,
) {
  let skip = Math.round(withdrawn * 100);
  let remaining = Math.round(amount * 100);
  const selected: number[] = [];
  let index = -1;
  for (const price of prices) {
    index++;
    const cents = Math.round(price * 100);
    if (!Number.isFinite(cents) || cents <= 0) continue;
    if (skip >= cents) {
      skip -= cents;
      continue;
    }
    if (remaining === 0) break;
    if (skip !== 0 || remaining < cents)
      throw new BadRequestException(
        'The payout does not match whole payment credits. Review the wallet and payment records before payout.',
      );
    remaining -= cents;
    selected.push(index);
  }
  if (skip !== 0 || remaining !== 0 || selected.length === 0)
    throw new BadRequestException(
      'Cannot reconcile payout amount with completed sales',
    );
  return selected;
}

export function countPayoutSales(
  prices: number[],
  withdrawn: number,
  amount: number,
) {
  return selectPayoutSales(prices, withdrawn, amount).length;
}

export async function getCreatorPayoutSaleSummary(
  creatorId: string,
  options: { currency?: string; amount?: number; walletBalance?: number } = {},
  executor: Pick<typeof db, 'select'> = db,
) {
  if (
    options.walletBalance === 0 &&
    (options.amount == null || options.amount === 0)
  )
    return { saleCount: 0, purchases: 0, rentals: 0 };
  const [sales, walletRows] = await Promise.all([
    executor
      .select({
        orderPrice: orders.price,
        itemType: orders.itemType,
        // The wallet is credited with the captured payment amount, which may
        // differ from the order price. Select one payment per order so retries
        // and duplicate payment records cannot inflate the sale count.
        price: sql<string | null>`(
          select ${payments.amount}
          from ${payments}
          where ${payments.orderId} = ${orders.id}
            and ${payments.status} = 'completed'
            and ${payments.currency} = ${options.currency ?? 'DKK'}
          order by ${payments.paidAt} asc nulls last,
                   ${payments.createdAt} asc, ${payments.id} asc
          limit 1
        )`,
      })
      .from(orders)
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .where(
        and(
          eq(orders.status, 'completed'),
          eq(orders.currency, options.currency ?? 'DKK'),
          or(
            and(
              isNotNull(orders.mediaFileId),
              eq(mediaFiles.creatorId, creatorId),
            ),
            and(
              isNull(orders.mediaFileId),
              eq(collections.creatorId, creatorId),
            ),
          ),
        ),
      )
      .orderBy(
        sql`(
        select coalesce(${payments.paidAt}, ${payments.createdAt})
        from ${payments}
        where ${payments.orderId} = ${orders.id}
          and ${payments.status} = 'completed'
          and ${payments.currency} = ${options.currency ?? 'DKK'}
        order by ${payments.paidAt} asc nulls last, ${payments.createdAt} asc, ${payments.id} asc
        limit 1
      ) asc nulls first`,
        asc(orders.id),
      ),
    options.walletBalance != null
      ? Promise.resolve([{ amount: String(options.walletBalance) }])
      : executor
          .select({ amount: creatorWallets.amount })
          .from(creatorWallets)
          .where(
            and(
              eq(creatorWallets.creatorId, creatorId),
              eq(creatorWallets.currency, options.currency ?? 'DKK'),
            ),
          )
          .limit(1),
  ]);
  if (
    sales.some((sale) =>
      sale.price == null
        ? Number(sale.orderPrice) !== 0
        : !Number.isFinite(Number(sale.price)),
    )
  )
    throw new BadRequestException(
      'A completed sale is missing its captured payment amount; reconcile its payment before requesting a payout',
    );
  const walletBalance = Number(walletRows[0]?.amount);
  if (!Number.isFinite(walletBalance) || walletBalance < 0)
    throw new BadRequestException(
      'A valid creator wallet balance is required to count payout sales',
    );
  const amount = options.amount ?? walletBalance;
  if (!Number.isFinite(amount) || amount < 0 || amount > walletBalance)
    throw new BadRequestException(
      'Requested payout exceeds the available wallet balance',
    );
  if (amount === 0) return { saleCount: 0, purchases: 0, rentals: 0 };
  const prices = sales.map((sale) => Number(sale.price));
  const creditCents = prices.reduce(
    (sum, price) => sum + Math.round(price * 100),
    0,
  );
  const settledCents = creditCents - Math.round(walletBalance * 100);
  if (settledCents < 0)
    throw new BadRequestException(
      'Wallet balance exceeds verified payment credits. Reconcile the missing payments before payout.',
    );
  // The remaining wallet, rather than imported historical payout totals, tells
  // us which FIFO payment credits are still unpaid. Legacy payouts may store
  // net amounts as raw amounts, so summing them cannot identify unpaid sales.
  const selected = selectPayoutSales(prices, settledCents / 100, amount);
  return {
    saleCount: selected.length,
    purchases: selected.filter((index) => sales[index].itemType === 'purchase')
      .length,
    rentals: selected.filter((index) => sales[index].itemType === 'rental')
      .length,
  };
}

export async function calculateCreatorPayoutFees(
  creatorId: string,
  options: Parameters<typeof calculatePayoutFees>[0] & {
    walletBalance?: number;
  },
  executor: Pick<typeof db, 'select'> = db,
) {
  let summary: { saleCount?: number; purchases?: number; rentals?: number };
  try {
    summary = await getCreatorPayoutSaleSummary(creatorId, options, executor);
  } catch (error) {
    // Percentage fees do not depend on a sale count; do not invent a count for
    // an imported wallet whose payment credits cannot yet be reconciled.
    if (
      !(error instanceof BadRequestException) ||
      (options.platformFeePct == null && options.fixedPlatformFee != null)
    )
      throw error;
    summary = {
      saleCount: undefined,
      purchases: undefined,
      rentals: undefined,
    };
  }
  return {
    ...calculatePayoutFees({ ...options, saleCount: summary.saleCount }),
    ...summary,
  };
}
