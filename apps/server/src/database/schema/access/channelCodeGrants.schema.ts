import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';

export const channelCodeGrants = pgTable(
  'channel_code_grants',
  {
    id: text('id').primaryKey(),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    codeHash: text('code_hash').notNull(),
    grantedAt: timestamp('granted_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => ({
    userCode: uniqueIndex('channel_code_grants_user_code_idx').on(
      table.creatorId,
      table.userId,
      table.codeHash,
    ),
  }),
);
