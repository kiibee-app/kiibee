import { BadRequestException } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collections,
  creatorInfo,
  subscriptions,
  plans,
  payments,
  orders,
  users,
  mediaFiles,
  subscriptionPaymentsHistory,
} from 'src/database/schema';
import { success } from 'src/utils/sendResponse';

export async function adminBillingHistoryService(
  kind: string,
  pageInput?: string,
) {
  if (kind !== 'subscription' && kind !== 'content') {
    throw new BadRequestException('Invalid billing history type');
  }
  const page = Math.max(1, Math.floor(Number(pageInput) || 1));
  if (!Number.isSafeInteger(page))
    throw new BadRequestException('Invalid page');
  const limit = 20;
  const rows =
    kind === 'subscription'
      ? await db
          .select({
            id: subscriptionPaymentsHistory.id,
            email: users.email,
            companyName: creatorInfo.companyName,
            reference: subscriptionPaymentsHistory.transactionId,
            description: sql<string>`coalesce(${plans.name}, ${subscriptionPaymentsHistory.subscriptionId})`,
            amount: subscriptionPaymentsHistory.amount,
            currency: subscriptionPaymentsHistory.currency,
            status: subscriptionPaymentsHistory.status,
            method: subscriptionPaymentsHistory.paymentMethodType,
            createdAt: subscriptionPaymentsHistory.createdAt,
          })
          .from(subscriptionPaymentsHistory)
          .leftJoin(users, eq(subscriptionPaymentsHistory.creatorId, users.id))
          .leftJoin(
            creatorInfo,
            eq(subscriptionPaymentsHistory.creatorId, creatorInfo.userId),
          )
          .leftJoin(
            subscriptions,
            eq(subscriptionPaymentsHistory.subscriptionId, subscriptions.id),
          )
          .leftJoin(plans, eq(subscriptions.planId, plans.id))
          .orderBy(
            desc(subscriptionPaymentsHistory.createdAt),
            desc(subscriptionPaymentsHistory.id),
          )
          .limit(limit + 1)
          .offset((page - 1) * limit)
      : await db
          .select({
            id: payments.id,
            email: users.email,
            companyName: creatorInfo.companyName,
            reference: payments.providerReference,
            description: sql<string>`coalesce(${mediaFiles.title}, ${collections.name}, ${orders.id})`,
            itemType: orders.itemType,
            amount: payments.amount,
            currency: payments.currency,
            status: payments.status,
            method: payments.provider,
            createdAt: payments.createdAt,
          })
          .from(payments)
          .innerJoin(orders, eq(payments.orderId, orders.id))
          .leftJoin(users, eq(orders.userId, users.id))
          .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
          .leftJoin(collections, eq(orders.collectionId, collections.id))
          .leftJoin(
            creatorInfo,
            eq(
              creatorInfo.userId,
              sql<string>`coalesce(${mediaFiles.creatorId}, ${collections.creatorId})`,
            ),
          )
          .orderBy(desc(payments.createdAt), desc(payments.id))
          .limit(limit + 1)
          .offset((page - 1) * limit);
  return success(
    { items: rows.slice(0, limit), page, hasMore: rows.length > limit },
    'Billing history fetched successfully',
    200,
  );
}
