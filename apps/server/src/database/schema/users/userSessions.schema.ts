import { pgTable, text, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { baseTimestamps } from 'src/utils/dbHelper';

export const userSessions = pgTable(
  'user_sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshTokenHash: text('refresh_token_hash').notNull(),
    ipAddress: varchar('ip_address', { length: 100 }),
    userAgent: text('user_agent'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ...baseTimestamps,
  },
  (table) => ({
    userIdIdx: index('user_sessions_user_id_idx').on(table.userId),
    expiresAtIdx: index('user_sessions_expires_at_idx').on(table.expiresAt),
  }),
);
