import { sql } from 'drizzle-orm';
import {
  pgTable,
  text,
  varchar,
  uuid,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { baseTimestamps, softDeleteFields } from 'src/utils/dbHelper';

export const creatorDeletionRequests = pgTable(
  'creator_deletion_requests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    status: varchar('status', { length: 30 }).notNull().default('pending'),
    reason: text('reason'),
    approvedUserId: text('approved_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    userIdIdx: index('creator_deletion_requests_user_id_idx').on(table.userId),
    statusIdx: index('creator_deletion_requests_status_idx').on(table.status),
    approvedUserIdIdx: index(
      'creator_deletion_requests_approved_user_id_idx',
    ).on(table.approvedUserId),
    isDeletedIdx: index('creator_deletion_requests_is_deleted_idx').on(
      table.isDeleted,
    ),
    pendingUserUnique: uniqueIndex(
      'creator_deletion_requests_pending_user_unique',
    )
      .on(table.userId)
      .where(sql`${table.status} = 'pending' and ${table.isDeleted} = false`),
  }),
);
