import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';

export const emailSubscribers = pgTable(
  'email_subscribers',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 200 }),
    source: varchar('source', { length: 50 }),
    sourceId: text('source_id'),

    isActive: boolean('is_active').notNull().default(true),
    subscribedAt: timestamp('subscribed_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),

    ...baseTimestamps,
  },
  (table) => ({
    creatorEmailUnique: uniqueIndex(
      'email_subscribers_creator_email_unique',
    ).on(table.creatorId, table.email),
    creatorIdIdx: index('email_subscribers_creator_id_idx').on(table.creatorId),
    emailIdx: index('email_subscribers_email_idx').on(table.email),
    isActiveIdx: index('email_subscribers_is_active_idx').on(table.isActive),
  }),
);
