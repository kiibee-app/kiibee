import { pgTable, text, integer, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql/sql';
import { baseTimestamps } from 'src/utils/dbHelper';

export const contentDownloadCount = pgTable(
  'content_download_counts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    contentId: text('content_id').notNull(),
    downloadCount: integer('download_count').notNull().default(0),
    ...baseTimestamps,
  },
  (table) => ({
    downloadCountCheck: check(
      'content_download_counts_download_count_check',
      sql`${table.downloadCount} >= 0`,
    ),
  }),
);
