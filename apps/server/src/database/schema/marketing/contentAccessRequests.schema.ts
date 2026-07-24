import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { mediaFiles } from '../content/mediaFiles.schema';
import { users } from '../users/users.schema';

export const contentAccessRequests = pgTable(
  'content_access_requests',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    contentId: text('content_id')
      .notNull()
      .references(() => mediaFiles.id, { onDelete: 'cascade' }),
    viewerEmail: varchar('viewer_email', { length: 255 }).notNull(),
    viewerName: varchar('viewer_name', { length: 200 }),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    approvalTokenHash: text('approval_token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    ...baseTimestamps,
  },
  (table) => ({
    requestUnique: uniqueIndex('content_access_requests_unique').on(
      table.creatorId,
      table.contentId,
      table.viewerEmail,
    ),
    tokenIdx: uniqueIndex('content_access_requests_token_unique').on(
      table.approvalTokenHash,
    ),
    creatorStatusIdx: index('content_access_requests_creator_status_idx').on(
      table.creatorId,
      table.status,
    ),
  }),
);
