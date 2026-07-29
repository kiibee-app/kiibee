import { pgTable, text, integer, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql/sql';
import { baseTimestamps } from 'src/utils/dbHelper';

export const contentLimits = pgTable(
  'content_limits',
  {
    id: text('id').primaryKey(),
    maxLimit: integer('max_limit').notNull(),
    ...baseTimestamps,
  },
  (table) => ({
    maxLimitCheck: check(
      'content_limits_max_limit_check',
      sql`${table.maxLimit} >= 0 AND ${table.maxLimit} <= 5`,
    ),
  }),
);
