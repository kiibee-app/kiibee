import { pgTable, text, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';
import { mediaFiles } from '../content/mediaFiles.schema';
import { collections } from '../content/collections.schema';
import { analyticsEventTypeEnum } from '../enums';

export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    mediaFileId: text('media_file_id').references(() => mediaFiles.id, {
      onDelete: 'set null',
    }),
    collectionId: text('collection_id').references(() => collections.id, {
      onDelete: 'set null',
    }),

    eventType: analyticsEventTypeEnum('event_type').notNull(),
    ipAddress: varchar('ip_address', { length: 100 }),
    userAgent: text('user_agent'),
    referrer: text('referrer'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    creatorIdIdx: index('analytics_events_creator_id_idx').on(table.creatorId),
    mediaFileIdIdx: index('analytics_events_media_file_id_idx').on(
      table.mediaFileId,
    ),
    collectionIdIdx: index('analytics_events_collection_id_idx').on(
      table.collectionId,
    ),
    eventTypeIdx: index('analytics_events_event_type_idx').on(table.eventType),
    createdAtIdx: index('analytics_events_created_at_idx').on(table.createdAt),
    creatorEventDateIdx: index('analytics_events_creator_event_date_idx').on(
      table.creatorId,
      table.eventType,
      table.createdAt,
    ),
  }),
);
