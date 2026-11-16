import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from 'src/database/db';
import { adminBillingRequests } from 'src/database/schema';

export async function settleAdminBillingRequest(
  database: Pick<typeof db, 'select' | 'update'>,
  input: {
    creatorId: string;
    planId: string;
    transactionId: string;
    status: 'completed' | 'failed';
    amount: string;
    currency: string;
  },
) {
  const [request] = await database
    .select({ id: adminBillingRequests.id })
    .from(adminBillingRequests)
    .where(
      and(
        eq(adminBillingRequests.creatorId, input.creatorId),
        eq(adminBillingRequests.planId, input.planId),
        inArray(adminBillingRequests.status, ['pending', 'failed']),
      ),
    )
    .orderBy(desc(adminBillingRequests.createdAt))
    .limit(1);
  if (!request) return;
  await database
    .update(adminBillingRequests)
    .set({
      status: input.status,
      transactionId: input.transactionId,
      amount: input.amount,
      currency: input.currency,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(adminBillingRequests.id, request.id),
        inArray(adminBillingRequests.status, ['pending', 'failed']),
      ),
    );
}

export async function recordAdminBillingEmail(id: string, sent: boolean) {
  await db
    .update(adminBillingRequests)
    .set({
      emailStatus: sent ? 'sent' : 'failed',
      emailSentAt: sent ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(adminBillingRequests.id, id));
}
