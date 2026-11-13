import { subscriptionBillingRows } from './subscriptionBillingRows';
import { BadRequestException } from '@nestjs/common';
import { desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collections,
  creatorInfo,
  payments,
  orders,
  users,
  mediaFiles,
} from 'src/database/schema';
import { success } from 'src/utils/sendResponse';

export async function adminBillingHistoryService(
  kind: string,
  pageInput?: string,
  creatorId?: string,
  searchInput?: string,
) {
  if (kind !== 'subscription' && kind !== 'content') {
    throw new BadRequestException('Invalid billing history type');
  }
  if (
    creatorId !== undefined &&
    (!creatorId.trim() || kind !== 'subscription')
  ) {
    throw new BadRequestException(
      'Creator billing history only supports subscriptions',
    );
  }
  const page = Math.max(1, Math.floor(Number(pageInput) || 1));
  if (!Number.isSafeInteger(page))
    throw new BadRequestException('Invalid page');
  const limit = 20;
  const search = searchInput?.trim();
  const pattern = search ? `%${search.replace(/[\\%_]/g, '\\$&')}%` : undefined;
  const customerSearch = pattern
    ? or(
        ilike(users.fullName, pattern),
        ilike(
          sql`concat_ws(' ', ${users.firstName}, ${users.lastName})`,
          pattern,
        ),
        ilike(users.email, pattern),
        ilike(creatorInfo.companyName, pattern),
      )
    : undefined;
  const rows =
    kind === 'subscription'
      ? await subscriptionBillingRows(page, creatorId, pattern)
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
          .where(
            pattern
              ? or(
                  customerSearch,
                  ilike(payments.providerReference, pattern),
                  ilike(mediaFiles.title, pattern),
                  ilike(collections.name, pattern),
                )
              : undefined,
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
