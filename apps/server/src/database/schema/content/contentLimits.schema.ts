import { pgTable, text, integer, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql/sql';
import { baseTimestamps } from 'src/utils/dbHelper';

export const contentLimits = pgTable(
  'content_limits',
  {
    id: text('id').primaryKey(),
    maxLimit: integer('max_limit').notNull(),
    maxStreamLimit: integer('max_stream_limit').notNull().default(7),
    ...baseTimestamps,
  },
  (table) => ({
    maxStreamLimitCheck: check(
      'content_limits_max_stream_limit_check',
      sql`${table.maxStreamLimit} >= 1 AND ${table.maxStreamLimit} <= 10`,
    ),
    maxLimitCheck: check(
      'content_limits_max_limit_check',
      sql`${table.maxLimit} >= 0 AND ${table.maxLimit} <= 10`,
    ),
  }),
);
