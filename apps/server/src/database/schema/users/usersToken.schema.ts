import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { baseTimestamps } from 'src/utils/dbHelper';
import { users } from './users.schema';

export const usersToken = pgTable('users_token', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  type: text('type').notNull(),
  isUsed: boolean('is_used').default(false),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ...baseTimestamps,
});
