import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { baseTimestamps } from 'src/utils/dbHelper';

export const accountSetupTokens = pgTable(
  'account_setup_tokens',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ...baseTimestamps,
  },
  (table) => ({
    userIdIdx: index('account_setup_tokens_user_id_idx').on(table.userId),
    expiresAtIdx: index('account_setup_tokens_expires_at_idx').on(
      table.expiresAt,
    ),
  }),
);
