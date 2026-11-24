import { BadRequestException } from '@nestjs/common';
import { and, desc, eq, isNull, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayoutRequests,
  creatorPayouts,
  creatorPlans,
  creatorWallets,
  plans,
} from 'src/database/schema';
import { calculateCreatorPayoutFees } from './creatorPayoutFees';

// Upgrade legacy pending requests once, atomically updating the shared payout.
// Completed/rejected requests and current-version fee snapshots are immutable.
export async function refreshPendingPayoutFees(
  creatorId?: string,
  requestId?: string,
  strict = true,
) {
  const errors: Record<string, string> = {};
  const candidates = await db
    .select({ id: creatorPayoutRequests.id })
    .from(creatorPayoutRequests)
    .where(
      and(
        eq(creatorPayoutRequests.status, 'pending'),
        or(
          isNull(creatorPayoutRequests.feeBreakdown),
          sql`coalesce(${creatorPayoutRequests.feeBreakdown}->>'calculationVersion', '0') <> '2'`,
        ),
        creatorId ? eq(creatorPayoutRequests.creatorId, creatorId) : undefined,
        requestId ? eq(creatorPayoutRequests.id, requestId) : undefined,
      ),
    );
  for (const candidate of candidates) {
    try {
      await db.transaction(async (tx) => {
        const [request] = await tx
          .select()
          .from(creatorPayoutRequests)
          .where(eq(creatorPayoutRequests.id, candidate.id))
          .limit(1)
          .for('update');
        if (
          !request ||
          request.status !== 'pending' ||
          request.feeBreakdown?.calculationVersion === 2
        )
          return;
        const [payout] = await tx
          .select()
          .from(creatorPayouts)
          .where(eq(creatorPayouts.id, request.payoutId))
          .limit(1)
          .for('update');
        if (
          !payout ||
          payout.status !== 'pending' ||
          payout.creatorId !== request.creatorId ||
          payout.currency !== request.currency ||
          Number(payout.rawAmount) !== Number(request.rawAmount)
        )
          throw new BadRequestException(
            'Pending payout does not match its request',
          );
        const [wallet] = await tx
          .select()
          .from(creatorWallets)
          .where(
            and(
              eq(creatorWallets.creatorId, request.creatorId),
              eq(creatorWallets.currency, request.currency),
            ),
          )
          .limit(1)
          .for('update');
        if (
          !wallet ||
          !Number.isFinite(Number(wallet.amount)) ||
          Number(wallet.amount) < Number(request.rawAmount)
        )
          throw new BadRequestException(
            'Insufficient balance to reconcile pending payout',
          );
        const [plan] = request.feeBreakdown
          ? [
              {
                price: 0,
                transactionFeePct:
                  request.feeBreakdown.processingFeePercentage * 100,
                platformFeePct:
                  request.feeBreakdown.fixedPlatformFee != null
                    ? null
                    : request.feeBreakdown.platformFeePercentage * 100,
                fixedPlatformFee: request.feeBreakdown.fixedPlatformFee,
              },
            ]
          : await tx
              .select({
                price: plans.price,
                transactionFeePct: creatorPlans.customTransactionFeePct,
                platformFeePct: creatorPlans.customKiibeeCutPct,
                fixedPlatformFee: creatorPlans.customKiibeeCutDkk,
              })
              .from(creatorPlans)
              .innerJoin(plans, eq(creatorPlans.planId, plans.id))
              .where(
                and(
                  eq(creatorPlans.creatorId, request.creatorId),
                  eq(creatorPlans.status, 'active'),
                ),
              )
              .orderBy(desc(creatorPlans.createdAt))
              .limit(1);
        if (!plan)
          throw new BadRequestException(
            'Active plan required to reconcile pending payout',
          );
        const fees = await calculateCreatorPayoutFees(
          request.creatorId,
          {
            amount: Number(request.rawAmount),
            basePlanPrice: Number(plan.price ?? 0),
            transactionFeePct: plan.transactionFeePct,
            platformFeePct: plan.platformFeePct,
            fixedPlatformFee: plan.fixedPlatformFee,
            currency: request.currency,
          },
          tx,
        );
        const now = new Date();
        await tx
          .update(creatorPayoutRequests)
          .set({
            platformFee: fees.platformFee.toFixed(2),
            processingFee: fees.processingFee.toFixed(2),
            payableAmount: fees.payableAmount.toFixed(2),
            feeBreakdown: {
              calculationVersion: 2,
              purchases: fees.purchases,
              rentals: fees.rentals,
              saleCount: fees.saleCount,
              fixedPlatformFee: fees.fixedPlatformFee,
              platformFeePercentage: fees.platformFeePercentage,
              processingFeePercentage: fees.processingFeePercentage,
            },
            updatedAt: now,
          })
          .where(
            and(
              eq(creatorPayoutRequests.id, request.id),
              eq(creatorPayoutRequests.status, 'pending'),
            ),
          );
        await tx
          .update(creatorPayouts)
          .set({ amount: fees.payableAmount.toFixed(2), updatedAt: now })
          .where(
            and(
              eq(creatorPayouts.id, payout.id),
              eq(creatorPayouts.status, 'pending'),
            ),
          );
      });
    } catch (error) {
      if (strict || !(error instanceof BadRequestException)) throw error;
      errors[candidate.id] = error.message;
    }
  }
  return errors;
}
