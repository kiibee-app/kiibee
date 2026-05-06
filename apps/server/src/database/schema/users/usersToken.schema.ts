import {
  boolean,
  pgTable,
  text,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from './users.schema';

export const usersToken = pgTable(
  'users_token',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    type: text('type').notNull(),
    isUsed: boolean('is_used').default(false),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ...baseTimestamps,
  },
  (table) => ({
    tokenUnique: uniqueIndex('users_token_token_unique').on(table.token),
    expiresAtIdx: index('users_token_expires_at_idx').on(table.expiresAt),
    userIdIsUsedIdx: index('users_token_user_id_is_used_idx').on(
      table.userId,
      table.isUsed,
    ),
  }),
);
