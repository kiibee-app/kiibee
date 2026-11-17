import { hasCustomSubscriptionValues } from './subscriptionTerms';
import { BadRequestException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { subscriptionCheckouts, creatorPlans } from 'src/database/schema';
export async function resolveSubscriptionCheckout(
  reference: string,
  creatorId: string,
  amount: number,
  currency: string,
) {
  const [checkout] = await db
    .select()
    .from(subscriptionCheckouts)
    .where(
      and(
        eq(subscriptionCheckouts.id, reference),
        eq(subscriptionCheckouts.creatorId, creatorId),
      ),
    )
    .limit(1);
  if (!checkout) return undefined; // Existing agreements still use the base plan ID.
  if (checkout.amountMinor !== amount || checkout.currency !== currency)
    throw new BadRequestException(
      'Payment does not match the subscription checkout',
    );
  if (checkout.customRevision != null && !checkout.paidAt) {
    const [offer] = await db
      .select({
        status: creatorPlans.customSubscriptionStatus,
        customPrice: creatorPlans.customPrice,
        customPrice3: creatorPlans.customPrice3,
        customPrice6: creatorPlans.customPrice6,
        customPrice12: creatorPlans.customPrice12,
        customMaxFiles: creatorPlans.customMaxFiles,
        customKiibeeCutDkk: creatorPlans.customKiibeeCutDkk,
        customTransactionFeePct: creatorPlans.customTransactionFeePct,
        revision: creatorPlans.customSubscriptionRevision,
      })
      .from(creatorPlans)
      .where(
        and(
          eq(creatorPlans.creatorId, creatorId),
          eq(creatorPlans.planId, checkout.planId),
          eq(creatorPlans.status, 'active'),
        ),
      )
      .limit(1);
    if (
      !offer ||
      !hasCustomSubscriptionValues(offer) ||
      !['draft', 'pending'].includes(offer?.status ?? '') ||
      offer?.revision !== checkout.customRevision
    )
      throw new BadRequestException(
        'This custom subscription offer is no longer active',
      );
  }
  return checkout;
}
