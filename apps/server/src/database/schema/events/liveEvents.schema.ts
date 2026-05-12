import {
  pgTable,
  text,
  varchar,
  numeric,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { baseTimestamps, softDeleteFields } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { accessTypeEnum, liveEventStatusEnum } from '../enums';

export const liveEvents = pgTable(
  'live_events',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: varchar('title', { length: 500 }).notNull(),
    description: text('description'),
    thumbnailUrl: text('thumbnail_url'),
    streamUrl: text('stream_url'),

    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }),

    accessType: accessTypeEnum('access_type').notNull().default('paid'),
    price: numeric('price', { precision: 10, scale: 2 }),
    currency: varchar('currency', { length: 10 }).default('DKK'),

    status: liveEventStatusEnum('status').notNull().default('scheduled'),

    ...softDeleteFields,
    ...baseTimestamps,
  },
  (table) => ({
    creatorIdIdx: index('live_events_creator_id_idx').on(table.creatorId),
    statusIdx: index('live_events_status_idx').on(table.status),
    scheduledAtIdx: index('live_events_scheduled_at_idx').on(table.scheduledAt),
    isDeletedIdx: index('live_events_is_deleted_idx').on(table.isDeleted),
  }),
);
