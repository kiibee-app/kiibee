import {
  pgTable,
  text,
  integer,
  numeric,
  date,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from '../users/users.schema';
import { mediaFiles } from '../content/mediaFiles.schema';
import { collections } from '../content/collections.schema';

export const analyticsDailySummary = pgTable(
  'analytics_daily_summary',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    mediaFileId: text('media_file_id').references(() => mediaFiles.id, {
      onDelete: 'cascade',
    }),
    collectionId: text('collection_id').references(() => collections.id, {
      onDelete: 'cascade',
    }),

    date: date('date').notNull(),

    views: integer('views').notNull().default(0),
    visits: integer('visits').notNull().default(0),
    clicks: integer('clicks').notNull().default(0),
    downloads: integer('downloads').notNull().default(0),
    rentals: integer('rentals').notNull().default(0),
    purchases: integer('purchases').notNull().default(0),
    revenue: numeric('revenue', { precision: 10, scale: 2 })
      .notNull()
      .default('0'),

    ...baseTimestamps,
  },
  (table) => ({
    creatorDateUnique: uniqueIndex('analytics_daily_summary_unique').on(
      table.creatorId,
      table.mediaFileId,
      table.collectionId,
      table.date,
    ),
    creatorIdIdx: index('analytics_daily_summary_creator_id_idx').on(
      table.creatorId,
    ),
    dateIdx: index('analytics_daily_summary_date_idx').on(table.date),
    creatorDateIdx: index('analytics_daily_summary_creator_date_idx').on(
      table.creatorId,
      table.date,
    ),
  }),
);
